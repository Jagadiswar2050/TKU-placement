// Vercel Serverless Entry Point
// This file exports the Express app as a Vercel serverless function.
// The app.listen() call in server.js is NOT used by Vercel — only the export matters.

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB (connection is cached across warm invocations)
connectDB();

const app = express();

// CORS: allow requests from any Vercel preview URL and the production domain.
// CLIENT_URL is set via Vercel Environment Variables in the dashboard.
const allowedOrigins = [
  process.env.CLIENT_URL,       // e.g. https://tku-placement.vercel.app
  'http://localhost:5173',       // local Vite dev server
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Vercel internal routing)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: Static file serving for uploads is not used in production on Vercel
// (Vercel is stateless — uploaded files do not persist across invocations).
// For production, integrate a cloud storage solution (e.g. Cloudinary, AWS S3).
// The route is kept so local development still works.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount all API routes (paths are relative to the Express app root,
// Vercel rewrites "/api/(.*)" to this function so the prefix is preserved)
app.use('/api/auth',         require('../routes/authRoutes'));
app.use('/api/students',     require('../routes/studentRoutes'));
app.use('/api/jobs',         require('../routes/jobRoutes'));
app.use('/api/applications', require('../routes/applicationRoutes'));
app.use('/api/companies',    require('../routes/companyRoutes'));
app.use('/api/admin',        require('../routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'College Placement Portal',
    team: 'Team 4 (Students S.No. 23 to 29)',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Export for Vercel (do NOT call app.listen here)
module.exports = app;
