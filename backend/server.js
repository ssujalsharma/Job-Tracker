const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Initialize MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Core Middlewares
// ============================================================================

// Enable CORS so the React frontend (running on port 5173) can access the API
app.use(cors());

// Parse incoming JSON payloads in request bodies
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: false }));

// Simple request logger for development visibility
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================================================
// API Routes
// ============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 JobTrack REST API is running!',
    endpoints: {
      health: 'GET /api/health',
      applications: 'GET /api/applications',
      createApplication: 'POST /api/applications',
      seedData: 'POST /api/applications/seed',
    },
  });
});

// Mount job applications resource routes
app.use('/api/applications', require('./routes/applicationRoutes'));

// ============================================================================
// Error Handling Middlewares
// ============================================================================

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route Not Found`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 JobTrack Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api/applications`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`========================================\n`);
});

module.exports = app;
