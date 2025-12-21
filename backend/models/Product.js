// src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    description: { type: String },
    countryOfOrigin: { type: String, required: true },
    imageUrl: { type: String },
    documentUrl: { type: String },
    packingSizes: { type: [String], default: [] },
    slug: { type: String }, // ← no index or unique here
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
