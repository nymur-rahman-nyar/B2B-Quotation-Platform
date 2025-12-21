// backend/routes/admin/auth.js

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../../models/Admin.js";

const router = Router();

// load env vars (already loaded in your index.js via dotenv/config)
const { JWT_SECRET, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } =
  process.env;

// In-memory OTP store (swap out for Redis in prod)
const otpStore = new Map();

// configure Nodemailer to use your SMTP_ settings
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER, // your full Gmail (or other) address
    pass: SMTP_PASS, // your app-specific password or API key
  },
});

/**
 * 1️⃣ STEP 1: credentials → send OTP + tempToken
 * PUT /api/admin/auth/login
 */
router.put("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password required" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // compare against the hashed password
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // generate a 6-digit OTP, valid for 5 minutes
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(admin._id.toString(), { code, expiresAt });

    // send it via email
    await transporter.sendMail({
      from: `"No-Reply" <${SMTP_USER}>`,
      to: admin.email,
      subject: "Your Admin Login Code",
      text: `Hello ${admin.username},\n\nYour login code is: ${code}\nIt expires in 5 minutes.`,
    });

    // issue temporary JWT so we know who’s verifying
    const tempToken = jwt.sign(
      { id: admin._id.toString(), username: admin.username, stage: "otp" },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({ tempToken });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * 2️⃣ STEP 2: verify OTP + tempToken → issue real JWT
 * POST /api/admin/auth/verify-otp
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { tempToken, otp } = req.body;
    if (!tempToken || !otp)
      return res.status(400).json({ message: "Token and OTP required" });

    let payload;
    try {
      payload = jwt.verify(tempToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired temp token" });
    }

    if (payload.stage !== "otp" || !payload.id)
      return res.status(400).json({ message: "Bad token stage" });

    const entry = otpStore.get(payload.id);
    if (!entry || entry.code !== otp || entry.expiresAt < Date.now())
      return res.status(401).json({ message: "Invalid or expired OTP" });

    // cleanup
    otpStore.delete(payload.id);

    // issue the final JWT
    const token = jwt.sign(
      { id: payload.id, username: payload.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res
      .status(500)
      .json({ message: "Server error during OTP verification" });
  }
});

export default router;
