// backend/scripts/createAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

dotenv.config();

async function run() {
  try {
    // 1) Connect via Mongoose — explicitly target damodordb
    await mongoose.connect(process.env.DB_URL, { dbName: "test" });
    console.log("✅ Connected to DB:", mongoose.connection.db.databaseName);

    // 2) Pull in your desired creds (falling back to defaults)
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "1234";
    const email = process.env.ADMIN_EMAIL || "admin@damodorbd.com";

    // 3) Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4) Create the admin
    const admin = await Admin.create({ username, passwordHash, email });
    console.log("🆕 Created admin:", {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
    });
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    // 5) Disconnect
    await mongoose.disconnect();
    console.log("⚡️ Disconnected");
    process.exit(0);
  }
}

run();
