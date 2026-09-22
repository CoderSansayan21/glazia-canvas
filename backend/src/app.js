const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const canvasRoutes = require('./routes/canvasRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow requests from the frontend URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '2mb' }));

// Request logging (dev only, useful for debugging)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check — useful for deployment platforms (AWS health checks, uptime monitors)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/canvases', canvasRoutes);

// 404 handler — no matching route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler — must be last
app.use(errorHandler);

module.exports = app;