import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import { connectCache } from "./config/cache.js";
import requestLogger from "./middleware/requestLogger.js";
import sanitize from "./middleware/sanitize.js";
import errorHandler from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();
connectCache();

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", "data:", "https:"], connectSrc: ["'self'"], frameAncestors: ["'none'"] },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "no-referrer" },
}));

const ALLOWED = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");
app.use(cors({
  origin: (origin, cb) => (!origin || ALLOWED.includes(origin) ? cb(null, true) : cb(new Error("CORS blocked"))),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  exposedHeaders: ["X-Request-Id"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(requestLogger);
app.use(sanitize);
app.use("/api", globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "3.0.0",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()) + "s",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, error: { code: "ROUTE_NOT_FOUND", message: `${req.method} ${req.originalUrl} not found` }, meta: { timestamp: new Date().toISOString() } });
});

app.use(errorHandler);

export default app;
