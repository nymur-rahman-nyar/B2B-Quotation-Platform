// index.js (Backend entry point)
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

// bring in your middlewares
import ipAllowlist from "./middlewares/ipAllowlist.js";
import authenticateToken from "./middlewares/auth.js";

import connectDB from "./configs/db.js";

// public routers
import publicProductsRouter from "./routes/public/products.js";
import publicServicesRouter from "./routes/public/services.js";
import quoteRouter from "./routes/public/quote.js";
import publicProjectsRouter from "./routes/public/projects.js";
import publicContacts from "./routes/public/contacts.js";
import aboutRouter from "./routes/public/about.js";
import publicBrandsRouter from "./routes/public/brands.js";

// admin routers
import authRouter from "./routes/admin/auth.js";
import productsRouter from "./routes/admin/products.js";
import servicesRouter from "./routes/admin/services.js";
import projectsRouter from "./routes/admin/projects.js";
import contactsRouter from "./routes/admin/contacts.js";
import aboutRoutes from "./routes/admin/about.js";
import cacheRoutes from "./routes/admin/cache.js";
import clientRoutes from "./routes/admin/client.js";
import brandRoutes from "./routes/admin/brands.js";
import testimonialRoutes from "./routes/admin/testimonials.js";

// Allowed origins: production + local dev
const PROD_URL = process.env.FRONTEND_URL || "https://damodor.com";
const DEV_URL = process.env.DEV_URL || "http://localhost:5173";
const allowedOrigins =
  process.env.NODE_ENV === "production" ? [PROD_URL] : [PROD_URL, DEV_URL];

const app = express();

// CORS must be registered before your routes
app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy forbids origin ${origin}`));
    },
    credentials: true, // so cookies / Authorization headers work
  })
);

// sanity-check for required environment variables
if (!process.env.DB_URL || !process.env.JWT_SECRET) {
  console.error("❌ Missing DB_URL or JWT_SECRET in environment");
  process.exit(1);
}

const PORT = process.env.PORT || 5555;
// if you're behind a proxy, trust it so req.ip is correct
app.set("trust proxy", true);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/** PUBLIC ENDPOINTS **/
app.use("/api/products", publicProductsRouter);
app.use("/api/services", publicServicesRouter);
app.use("/api/quote", quoteRouter);
app.use("/api/projects", publicProjectsRouter);
app.use("/api/contacts", publicContacts);
app.use("/api/about", aboutRouter);
app.use("/api/brands", publicBrandsRouter);
app.get("/health", (_req, res) => res.sendStatus(200));

/** ADMIN IP ALLOWLIST CHECK **/
// 1️⃣ expose a dedicated check-ip endpoint for React’s AdminGate
app.get("/api/admin/check-ip", ipAllowlist, (_req, res) => {
  // if ipAllowlist passes → HTTP 200
  res.sendStatus(200);
});

// 2️⃣ apply the allowlist to all other /api/admin routes
app.use("/api/admin", ipAllowlist);

/** AUTH (login + 2FA verify) **/
// mounted at /api/admin/auth/*
app.use("/api/admin/auth", authRouter);

/** PROTECTED ADMIN ROUTES (IP + JWT) **/
app.use("/api/admin/cache", authenticateToken, cacheRoutes);
app.use("/api/admin/products", authenticateToken, productsRouter);
app.use("/api/admin/services", authenticateToken, servicesRouter);
app.use("/api/admin/projects", authenticateToken, projectsRouter);
app.use("/api/admin/contacts", authenticateToken, contactsRouter);

app.use("/api/admin/about", authenticateToken, aboutRoutes);
app.use("/api/admin/about/clients", authenticateToken, clientRoutes);
app.use("/api/admin/about/brands", authenticateToken, brandRoutes);
app.use("/api/admin/about/testimonials", authenticateToken, testimonialRoutes);

/** 404 + GLOBAL ERROR HANDLING **/
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
app.use((err, _req, res, _next) => {
  console.error("🚨 Server error:", err);
  res.status(500).json({ error: err.message });
});

/** START **/
connectDB(process.env.DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Mongo connection failed:", err);
    process.exit(1);
  });
