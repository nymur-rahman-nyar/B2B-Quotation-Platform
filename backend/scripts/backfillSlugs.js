// scripts/backfillSlugs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

// same logic as your app
function makeBaseSlug(brand, name) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(brand, name) {
  const base = makeBaseSlug(brand, name);
  let slug = base;
  let counter = 1;

  // as long as another doc already has this slug, bump a suffix
  while (await Product.exists({ slug })) {
    slug = `${base}-${counter++}`;
  }

  return slug;
}

async function main() {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("🔌 Connected to MongoDB");

  const products = await Product.find({
    $or: [{ slug: { $exists: false } }, { slug: "" }],
  }).lean();

  console.log(`🛠  Backfilling ${products.length} products…`);
  for (const p of products) {
    const newSlug = await generateUniqueSlug(p.brand, p.name);
    await Product.updateOne({ _id: p._id }, { $set: { slug: newSlug } });
    console.log(` • ${p.name} → ${newSlug}`);
  }

  console.log("✅ All done!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
