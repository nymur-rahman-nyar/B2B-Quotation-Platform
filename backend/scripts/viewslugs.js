// scripts/listSlugs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

async function main() {
  // 1) connect to MongoDB; make sure MONGO_URI is set in your .env
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // 2) fetch only name + slug for all products
  const products = await Product.find({}, "name slug").lean();

  // 3) print them
  console.log("Products and their slugs:");
  console.log("-------------------------");
  products.forEach((p) => {
    console.log(`${p.name} → ${p.slug || "[no slug]"}`);
  });

  // 4) clean up
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error listing slugs:", err);
  process.exit(1);
});
