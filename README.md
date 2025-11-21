# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2f96eebd-7470-411e-b85f-1791d7d3f091

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2f96eebd-7470-411e-b85f-1791d7d3f091) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2f96eebd-7470-411e-b85f-1791d7d3f091) and click on Share -> Publish.

## MongoDB Atlas configuration

The application now targets your MongoDB Atlas cluster at `cluster101.chqmam8.mongodb.net` using the `kyalomuchende_db_user` credentials you provided. To run locally or in any hosting provider, create `.env` files that mirror the provided `env.example` files:

```
MONGODB_URI=mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
MONGODB_DB=mamacare
VITE_MONGODB_URI=mongodb+srv://kyalomuchende_db_user:1234@cluster101.chqmam8.mongodb.net/mamacare?retryWrites=true&w=majority
VITE_MONGODB_DB=mamacare
VITE_API_BASE_URL=http://localhost:4000
```

Replicate the same MongoDB values inside `backend/.env` and add a `JWT_SECRET` for signing auth tokens. Once those environment variables are present, both the backend API and any server-side utilities will connect directly to the Atlas database.

## Local authentication (Get Started & Login)

The Supabase helpers were removed in favor of a lightweight credential-based flow backed by MongoDB Atlas:

- `POST /api/auth/signup` – creates a user (first/last name, email, password) and returns a signed token.
- `POST /api/auth/login` – verifies credentials and returns a token plus the user profile.
- `POST /api/pregnancy-profile` – now expects a `Bearer <token>` header so only signed-in users can save their journey.

On the frontend, visit `/signup` to create an account or `/login` to sign back in. Successful auth sessions are stored in localStorage and power the multi-step Get Started experience at `/get-started`.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
