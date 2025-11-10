// server.js (ESM)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';

import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import paymentRoutes from './src/routes/payments.js';
import adminRoutes from './src/routes/adminRoutes.js';
import cloudinaryRoutes from './src/routes/cloudinary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------------------
   Basic request logger (no morgan)
---------------------------------- */
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

/* -------------------------------
   Core middlewares
---------------------------------- */
app.use(
  cors({
    origin: true, // or set your frontend origin explicitly
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

/* -------------------------------
   Database
---------------------------------- */
connectDB();

/* -------------------------------
   Health
---------------------------------- */
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'mini-mern-shop' });
});

/* -------------------------------
   Routes
---------------------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', cloudinaryRoutes);

/* -------------------------------
   Error handler
---------------------------------- */
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((v) => v.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error',
      keyValue: err.keyValue,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Default
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/* -------------------------------
   Start server
---------------------------------- */
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
