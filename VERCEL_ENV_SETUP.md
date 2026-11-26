# ============================================================
# Vercel Environment Variables — set these in the Vercel dashboard
# Project → Settings → Environment Variables
# ============================================================

# --- Backend service (apply to: backend service / All Environments) ---
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/placement_portal?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
NODE_ENV=production

# CLIENT_URL: the full URL of your deployed Vercel project
# (used by backend CORS to allow frontend requests)
CLIENT_URL=https://tku-placement.vercel.app

# --- Frontend service (apply to: frontend service / All Environments) ---
# Leave VITE_API_BASE_URL unset in production — the Vercel rewrite handles /api/*
# Only set it for local development (in frontend/.env.local):
#   VITE_API_BASE_URL=http://localhost:5000/api
