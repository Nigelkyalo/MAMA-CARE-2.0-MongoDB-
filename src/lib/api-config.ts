// API Configuration
// This file centralizes the API base URL configuration

// Get the API URL from environment variable
// For production (Vercel), set VITE_API_BASE_URL in environment variables
// For local development, it will use localhost:4000
// For Render deployment, use your Render backend URL

const getApiBaseUrl = (): string => {
  // First, check if environment variable is set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // If running in production (Vercel), use Render backend
  // IMPORTANT: Update this with your actual Render backend URL
  // You can find it in your Render dashboard
  if (import.meta.env.PROD) {
    // TODO: Replace with your actual Render backend URL
    // Example: "https://mamacare-backend-xxxx.onrender.com"
    // To find your URL: Go to Render dashboard → Your service → Copy the URL
    const renderBackendUrl = "https://mamacare-backend.onrender.com";
    
    // If you set VITE_API_BASE_URL in Vercel, it will override this
    return renderBackendUrl;
  }

  // Default to localhost for local development
  return "http://localhost:4000";
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL);
}

