// models/Admin.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // no 2FA secret needed here
});

export default mongoose.model("Admin", AdminSchema);
