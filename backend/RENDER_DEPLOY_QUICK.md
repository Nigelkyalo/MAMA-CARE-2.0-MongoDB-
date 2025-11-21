# Quick Render Deployment Steps

## 1. Go to Render Dashboard
Visit https://dashboard.render.com

## 2. Create New Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repo: `Nigelkyalo/MAMA-CARE-2.0-MongoDB-`

## 3. Configure Service

**Settings:**
- **Name**: `mamacare-backend`
- **Root Directory**: `backend` ⚠️ **CRITICAL: Set this!**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run start:dev` (uses ts-node directly, no build needed)

**Environment Variables (Add these):**
```
MONGODB_URI = mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
MONGODB_DB = mamacare
JWT_SECRET = your-secret-key-here-make-it-long
NODE_ENV = production
```

**Plan**: Free

## 4. Deploy
Click **"Create Web Service"** and wait ~5 minutes

## 5. Get Your URL
After deployment, copy your URL: `https://mamacare-backend.onrender.com`

## 6. Update Frontend
In Vercel, add environment variable:
- `VITE_API_BASE_URL` = `https://mamacare-backend.onrender.com`

## Done! 🎉

Test at: `https://your-backend-url.onrender.com/api/health`

