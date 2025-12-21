// src/models/About.js
import mongoose from "mongoose";

// Stores the single About‐Us document
const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);
