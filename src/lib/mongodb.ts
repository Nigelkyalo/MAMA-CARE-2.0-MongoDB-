import { MongoClient } from 'mongodb';

const mongoUri = import.meta.env.VITE_MONGODB_URI;

if (!mongoUri) {
  throw new Error('VITE_MONGODB_URI environment variable is not set');
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db(import.meta.env.VITE_MONGODB_DB || 'mamacare');
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
