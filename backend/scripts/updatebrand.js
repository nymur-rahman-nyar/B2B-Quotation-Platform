// scripts/updateBrand.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

async function main() {
  // 1) connect
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("🔌 Connected to MongoDB");

  // 2) update all products where brand is exactly "Mr. Mckenic"
  const result = await Product.updateMany(
    { brand: "Mr. Mckenic" },
    { $set: { brand: "Mr.McKenic" } }
  );

  console.log(
    `📝 Matched ${result.matchedCount} document(s), modified ${result.modifiedCount} document(s)`
  );

  // 3) disconnect
  await mongoose.disconnect();
  console.log("✅ Disconnected");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
