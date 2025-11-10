// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import paymentRoutes from "./src/routes/payments.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cloudinaryRoutes from "./src/routes/cloudinary.js";

// -------------------------------
//  Environment Setup
// -------------------------------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------
//  Database Connection
// -------------------------------
connectDB();

// -------------------------------
//  Request Logger
// -------------------------------
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// -------------------------------
//  CORS Configuration
// -------------------------------
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://e-commerce-1-w9kc.onrender.com", // your frontend URL (Render)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Not allowed by server."));
      }
    },
    credentials: true,
  })
);

// -------------------------------
//  Core Middleware
// -------------------------------
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// -------------------------------
//  Static Files (for logo.png etc.)
// -------------------------------
app.use(express.static(path.join(__dirname, "public")));

// -------------------------------
//  Health Check
// -------------------------------
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "mini-mern-shop" });
});

// -------------------------------
//  API Routes
// -------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", cloudinaryRoutes);

// -------------------------------
//  404 Fallback for unknown routes
// -------------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// -------------------------------
//  Global Error Handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((v) => v.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate key error",
      keyValue: err.keyValue,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired" });
  }

  if (err.message === "CORS policy: Not allowed by server.") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Request origin not permitted.",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// -------------------------------
//  Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Frontend allowed origins: ${allowedOrigins.join(", ")}`);
});
