import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { MongoClient, type Collection, type Db, type Document, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "mamacare";
const JWT_SECRET = process.env.JWT_SECRET || "dev_change_me";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(MONGODB_URI);
let cachedDbPromise: Promise<Db> | null = null;

async function getDb() {
  if (!cachedDbPromise) {
    cachedDbPromise = client.connect().then(() => client.db(MONGODB_DB));
  }
  return cachedDbPromise;
}

async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

type UserDocument = {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const serializeUser = (doc: UserDocument) => ({
  id: doc._id.toHexString(),
  firstName: doc.firstName,
  lastName: doc.lastName,
  email: doc.email,
});

const createToken = (userId: string) => jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });

const extractUserIdFromRequest = (req: Request): string | null => {
  const header = req.header("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
};

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body ?? {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "First name, last name, email, and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const users = await getCollection<UserDocument>("users");
    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const userDocument: UserDocument = {
      _id: new ObjectId(),
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    await users.insertOne(userDocument);

    const token = createToken(userDocument._id.toHexString());
    return res.status(201).json({
      success: true,
      user: serializeUser(userDocument),
      token,
    });
  } catch (error) {
    console.error("Failed to create account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const users = await getCollection<UserDocument>("users");
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await users.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = createToken(user._id.toHexString());
    return res.json({
      success: true,
      user: serializeUser(user),
      token,
    });
  } catch (error) {
    console.error("Failed to login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/pregnancy-profile", async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const collection = await getCollection("pregnancy_profiles");
    const profile = await collection.findOne({ userId }, { sort: { createdAt: -1 } });

    if (!profile) {
      return res.status(404).json({ error: "No pregnancy profile found" });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Failed to fetch pregnancy profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/pregnancy-profile", async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = req.body ?? {};
    if (!profile.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const collection = await getCollection("pregnancy_profiles");
    const existing = await collection.findOne({ userId });

    const doc = {
      ...profile,
      userId,
      updatedAt: new Date(),
    };

    if (existing) {
      // Update existing profile
      await collection.updateOne({ userId }, { $set: doc });
      const updated = await collection.findOne({ userId });
      return res.json({
        success: true,
        message: "Pregnancy profile updated successfully",
        data: updated,
      });
    } else {
      // Create new profile
      const newDoc = {
        ...doc,
        createdAt: new Date(),
      };
      const result = await collection.insertOne(newDoc);
      const created = await collection.findOne({ _id: result.insertedId });
      return res.status(201).json({
        success: true,
        message: "Pregnancy profile saved successfully",
        data: created,
      });
    }
  } catch (error) {
    console.error("Failed to save pregnancy profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Seed default user on server start
async function seedDefaultUser() {
  try {
    const users = await getCollection<UserDocument>("users");
    const defaultEmail = "kyalomuchende@gmail.com";
    const defaultPassword = "123456";
    
    const existing = await users.findOne({ email: defaultEmail });
    if (existing) {
      console.log("Default user already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const now = new Date();
    const userDocument: UserDocument = {
      _id: new ObjectId(),
      firstName: "Nigel",
      lastName: "Kyalo",
      email: defaultEmail,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    await users.insertOne(userDocument);
    console.log("Default user created successfully:", defaultEmail);
  } catch (error) {
    console.error("Failed to seed default user:", error);
  }
}

// Initialize database and seed user
getDb()
  .then(() => {
    console.log("Database connected");
    return seedDefaultUser();
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

