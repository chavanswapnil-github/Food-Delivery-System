// Central place for the backend base URL.
// In production (Vercel) this comes from the VITE_API_URL env var.
// Locally it falls back to your local backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
