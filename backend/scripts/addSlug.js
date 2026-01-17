// backend/scripts/addSlugs.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

function generateSlug(brand, name) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  try {
    // 1) Connect (use whatever DB_URL your app already uses)
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB:", mongoose.connection.db.databaseName);

    // 2) Find products missing slug
    const products = await Product.find({
      $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
    });
    console.log(`Found ${products.length} products without a slug.`);

    // 3) For each, generate & save
    for (let p of products) {
      try {
        const base = generateSlug(p.brand, p.name);
        let unique = base;
        let counter = 0;

        // Make sure it's unique
        // ( skips the very document we're editing because its slug is missing/empty )
        while (await Product.exists({ slug: unique })) {
          counter += 1;
          unique = `${base}-${counter}`;
        }

        p.slug = unique;
        await p.save();
        console.log(`  ✓ [${p._id}] → ${unique}`);
      } catch (err) {
        console.error(`  ✗ [${p._id}] save error:`, err.message);
      }
    }

    console.log("Slug migration complete!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await mongoose.disconnect();
    console.log(" Disconnected");
    process.exit(0);
  }
}

run();
