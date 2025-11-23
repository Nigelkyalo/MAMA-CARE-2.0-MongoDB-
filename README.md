# MamaCare - Pregnancy Care Application

A comprehensive pregnancy care application built with React, TypeScript, and MongoDB Atlas. MamaCare helps expecting mothers track their pregnancy journey, manage appointments, receive health tips, and stay connected with healthcare providers.

**Live Application**: [https://mama-care-2-0-mongo-db.vercel.app/](https://mama-care-2-0-mongo-db.vercel.app/)

## Features

- 📅 **Pregnancy Tracking**: Track your pregnancy progress with personalized timelines
- 🔔 **Smart Reminders**: Never miss appointments, medications, or important health tips
- 🏥 **Healthcare Management**: Connect with your preferred hospitals and clinics
- 💬 **Multi-language Support**: Available in English, Swahili, Kikuyu, and Luo
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔐 **Secure Authentication**: User registration and login with JWT token-based authentication
- 💾 **MongoDB Atlas Integration**: All data stored securely in MongoDB Atlas cloud database

## Technologies

This project is built with modern web technologies:

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui components
  - React Router DOM
  - React Query (TanStack Query)

- **Backend**:
  - Node.js
  - Express.js
  - TypeScript
  - MongoDB Atlas (Cloud Database)
  - JWT for authentication
  - bcryptjs for password hashing

- **Database**:
  - MongoDB Atlas (Cloud Database)
  - MongoDB Driver for Node.js
  - Collections: `users`, `pregnancy_profiles`

## Project Structure

```
expecting-ease-care/
├── backend/          # Express.js backend API
├── src/             # React frontend application
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── context/     # React context providers
│   └── lib/         # Utility functions and database connections
├── public/          # Static assets
└── supabase/        # Supabase configuration (legacy - removed)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository**
```sh
   git clone https://github.com/Nigelkyalo/MAMA-CARE-2.0-MongoDB-.git
   cd MAMA-CARE-2.0-MongoDB-
   ```

2. **Install frontend dependencies**
   ```sh
   npm install
   ```

3. **Install backend dependencies**
   ```sh
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
   MONGODB_DB=mamacare
   VITE_MONGODB_URI=mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
   VITE_MONGODB_DB=mamacare
   PORT=4000
   VITE_API_BASE_URL=http://localhost:4000
   JWT_SECRET=your_jwt_secret_key_here
   ```

   Create a `backend/.env` file:
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
   MONGODB_DB=mamacare
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. **Start the development servers**

   Terminal 1 - Frontend:
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:8080` (or another port if 8080 is in use)

   Terminal 2 - Backend:
   ```sh
   cd backend
   npm run dev
   ```
   The backend API will be available at `http://localhost:4000`

## MongoDB Atlas Configuration

The application is configured to use MongoDB Atlas cloud database:

- **Cluster**: `cluster101.chqmam8.mongodb.net`
- **Database Name**: `mamacare`
- **Username**: `kyalomuchende_db_user`
- **Authentication**: Username and password-based authentication with MongoDB Atlas
- **Connection String**: `mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority`

### MongoDB Collections

The application uses the following MongoDB collections:

1. **`users`** - Stores user authentication information
   - `_id`: ObjectId
   - `firstName`: string
   - `lastName`: string
   - `email`: string (unique, indexed)
   - `passwordHash`: string (bcrypt hashed)
   - `createdAt`: Date
   - `updatedAt`: Date

2. **`pregnancy_profiles`** - Stores pregnancy profile data
   - `_id`: ObjectId
   - `userId`: string (references users._id)
   - `firstName`: string
   - `lastName`: string
   - `email`: string
   - `phone`: string
   - `age`: string
   - `calculationMethod`: "dueDate" | "lastMenstrualPeriod"
   - `dueDate`: string (optional)
   - `lastMenstrualPeriod`: string (optional)
   - `pregnancyNumber`: string
   - `location`: string
   - `hospital`: string
   - `healthConditions`: string[]
   - `language`: string
   - `reminders`: object
   - `communicationMethod`: string
   - `agreedToTerms`: boolean
   - `createdAt`: Date
   - `updatedAt`: Date

### MongoDB Connection Setup

1. **MongoDB Atlas Setup**:
   - Ensure your MongoDB Atlas cluster allows connections from your IP address
   - Add your IP address to the IP Access List in MongoDB Atlas dashboard
   - Verify the database user credentials match your `.env` files

2. **Connection Verification**:
   - The backend automatically connects to MongoDB Atlas on startup
   - Check backend logs for successful connection confirmation
   - If connection fails, verify your MongoDB URI and network access settings

## Authentication System

MamaCare uses a custom authentication system built with JWT tokens and MongoDB:

### API Endpoints

- `POST /api/auth/signup` - Register a new user
  - Requires: `firstName`, `lastName`, `email`, `password`
  - Stores user in MongoDB `users` collection
  - Returns: JWT token and user profile

- `POST /api/auth/login` - Authenticate existing user
  - Requires: `email`, `password`
  - Validates credentials against MongoDB `users` collection
  - Returns: JWT token and user profile

- `GET /api/pregnancy-profile` - Fetch user's pregnancy profile (Protected)
  - Requires: `Authorization: Bearer <token>` header
  - Fetches profile from MongoDB `pregnancy_profiles` collection
  - Returns: User's pregnancy profile data

- `POST /api/pregnancy-profile` - Save/Update pregnancy profile (Protected)
  - Requires: `Authorization: Bearer <token>` header
  - Requires: Complete pregnancy profile data
  - Upserts profile in MongoDB `pregnancy_profiles` collection
  - Returns: Saved/updated profile data

- `GET /api/health` - Health check endpoint
  - Returns: `{ status: "ok" }`

### Frontend Routes

- `/login` - User login page (authenticates with MongoDB)
- `/get-started` - Multi-step pregnancy profile setup form (saves to MongoDB)
- `/dashboard` - Personalized dashboard showing all details from MongoDB

## Deployment

The application is deployed on Vercel:

- **Production URL**: [https://mama-care-2-0-mongo-db.vercel.app/](https://mama-care-2-0-mongo-db.vercel.app/)

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build commands:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy!

### Environment Variables for Production

Make sure to set all the environment variables in your Vercel project settings, including:

**Frontend Environment Variables (Vercel)**:
- `VITE_MONGODB_URI` - MongoDB Atlas connection string
- `VITE_MONGODB_DB` - MongoDB database name
- `VITE_API_BASE_URL` - Your backend API URL (e.g., Render backend URL)

**Backend Environment Variables (Render/Backend Host)**:
- `MONGODB_URI` - MongoDB Atlas connection string
- `MONGODB_DB` - MongoDB database name
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 4000)

### MongoDB Atlas Production Configuration

1. **Network Access**: Ensure your MongoDB Atlas cluster allows connections from:
   - Your Render backend server IP (if using Render)
   - Vercel serverless function IPs (if using Vercel serverless functions)
   - Or use `0.0.0.0/0` for development (not recommended for production)

2. **Database User**: Ensure the MongoDB user has appropriate permissions:
   - Read and write access to the `mamacare` database
   - Access to create collections if needed

3. **Connection String**: Use the connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Nigel Kyalo**
- GitHub: [@Nigelkyalo](https://github.com/Nigelkyalo)
- Project Repository: [MAMA-CARE-2.0-MongoDB-](https://github.com/Nigelkyalo/MAMA-CARE-2.0-MongoDB-)

## Support

For support, please open an issue in the GitHub repository or contact the project maintainers.

---

**Note**: This application is designed to support expecting mothers throughout their pregnancy journey. Always consult with healthcare professionals for medical advice.
