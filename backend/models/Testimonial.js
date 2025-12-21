// src/models/Testimonial.js
import mongoose from "mongoose";

// Testimonials shown on the About → Testimonials panel
const testimonialSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    author: { type: String, required: true },
    quote: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
