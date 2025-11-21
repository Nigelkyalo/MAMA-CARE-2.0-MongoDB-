# Backend URL Setup Guide

## The Problem
The frontend is trying to connect to `http://localhost:4000` but your backend is deployed on Render.

## Solution Options

### Option 1: Set Environment Variable in Vercel (Recommended)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `MAMA-CARE-2.0-MongoDB-`
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-name.onrender.com` (replace with your actual Render URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** tab
7. Click the three dots (⋯) on the latest deployment
8. Click **Redeploy**

### Option 2: Update the Default URL in Code

If you don't want to set environment variables, you can update the default URL in the code:

1. Open `src/lib/api-config.ts`
2. Find this line:
   ```typescript
   return "https://mamacare-backend.onrender.com";
   ```
3. Replace `mamacare-backend.onrender.com` with your actual Render backend URL
4. Commit and push the changes

### Option 3: For Local Development

If you want to test locally with the Render backend:

1. Create a `.env` file in the root directory (if it doesn't exist)
2. Add this line:
   ```
   VITE_API_BASE_URL=https://your-backend-name.onrender.com
   ```
3. Restart your dev server: `npm run dev`

## How to Find Your Render Backend URL

1. Go to https://dashboard.render.com
2. Click on your web service (the backend you deployed)
3. Look at the top of the page - you'll see a URL like:
   - `https://mamacare-backend-xxxx.onrender.com`
4. Copy this URL and use it in the steps above

## Testing

After setting up:

1. Open your browser's developer console (F12)
2. Try to log in
3. Check the Network tab to see if requests are going to the correct URL
4. The console should show: `API Base URL: https://your-backend-url.onrender.com`

## Troubleshooting

### Still getting "Unable to connect to server"
- Verify your Render backend is running (check Render dashboard)
- Verify the URL is correct (no typos)
- Check if Render backend has spun down (free tier spins down after 15 min inactivity)
- Wait ~30 seconds for the first request after spin-down

### CORS Errors
- The backend already has CORS enabled for all origins
- If you see CORS errors, check Render logs

### 404 Errors
- Make sure your Render backend URL is correct
- Check that the backend is deployed successfully
- Verify the API endpoints are working: `https://your-backend-url.onrender.com/api/health`

