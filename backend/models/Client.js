// src/models/Client.js
import mongoose from "mongoose";

// Clients shown on the About → Clients panel
const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String }, // URL or local path to the client’s logo
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
