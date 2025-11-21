# Deploying MamaCare Backend to Render

This guide will walk you through deploying the MamaCare backend API to Render.

## Prerequisites

1. A GitHub account (your code is already on GitHub)
2. A Render account (sign up at https://render.com if you don't have one)
3. Your MongoDB Atlas connection string (already configured)

## Step 1: Create a Render Account

1. Go to https://render.com
2. Click "Get Started" and sign up (you can use GitHub to sign up)
3. Verify your email if needed

## Step 2: Create a New Web Service

1. From your Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if you haven't already
4. Find and select your repository: **`Nigelkyalo/MAMA-CARE-2.0-MongoDB-`**
5. Click **"Connect"**

## Step 3: Configure the Web Service

Fill in the following settings:

### Basic Settings:
- **Name**: `mamacare-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose the closest region to your users (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install` (this installs dependencies and uses ts-node)
- **Start Command**: `npm start` (runs TypeScript directly using ts-node)

### Environment Variables:

Click on **"Advanced"** and add the following environment variables:

1. **MONGODB_URI**
   - Value: `mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority`

2. **MONGODB_DB**
   - Value: `mamacare`

3. **JWT_SECRET**
   - Value: Generate a secure random string (you can use: `openssl rand -base64 32` or visit https://randomkeygen.com/)
   - Example: `your-super-secret-jwt-key-here-make-it-long-and-random`

4. **PORT**
   - Value: `4000` (or leave empty, Render will set this automatically)

5. **NODE_ENV**
   - Value: `production`

### Plan:
- Select **"Free"** plan (good for testing)
- Click **"Create Web Service"**

## Step 4: Wait for Deployment

Render will:
1. Clone your repository
2. Install dependencies
3. Build your TypeScript code
4. Start your server

This takes about 3-5 minutes. You can watch the build logs in real-time.

## Step 5: Get Your Backend URL

Once deployment is complete:

1. Render will show you a URL like: `https://mamacare-backend.onrender.com`
2. Copy this URL - you'll need it for your frontend

## Step 6: Update Frontend Environment Variables

Now update your Vercel deployment (or local `.env`) with the backend URL:

### In Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   - **VITE_API_BASE_URL**: `https://your-backend-url.onrender.com`
   - Replace `your-backend-url` with your actual Render URL

### In Local `.env`:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## Step 7: Test Your Deployment

1. Visit: `https://your-backend-url.onrender.com/api/health`
2. You should see: `{"status":"ok"}`

3. Test login with:
   - Email: `kyalomuchende@gmail.com`
   - Password: `123456`

## Troubleshooting

### Build Fails:
- Check the build logs in Render dashboard
- Make sure `Root Directory` is set to `backend`
- Verify all dependencies are listed in `package.json`

### Application Crashes:
- Check the logs tab in Render dashboard
- Verify all environment variables are set correctly
- Make sure MongoDB URI is correct and accessible

### CORS Errors:
- The backend already has CORS enabled for all origins
- If issues persist, check that `origin: "*"` is in the CORS config

### Database Connection Issues:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas (or allow all IPs)

## Free Plan Limitations

- **Spins down after 15 minutes of inactivity** (first request after spin-down takes ~30 seconds)
- **750 hours/month free** (enough for 24/7 for most of the month)
- **No custom domain** (but you can use the provided .onrender.com URL)

## Important Notes

1. **First deployment takes longer** - Render needs to build everything
2. **Subsequent deployments** are faster (only changed files)
3. **Health checks** - Render automatically pings your `/api/health` endpoint
4. **Logs** - Always check logs if something doesn't work
5. **Environment Variables** - Keep `JWT_SECRET` secure and don't commit it to Git

## Next Steps

After successful deployment:
1. Test the API endpoints
2. Update frontend to use the new backend URL
3. Test login flow end-to-end
4. Monitor logs for any issues

## Support

- Render Documentation: https://render.com/docs
- Render Status: https://status.render.com

