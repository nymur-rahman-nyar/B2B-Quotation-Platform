import express from "express";
import Brand from "../../models/Brand.js";
import cache from "../../utils/cache.js"; // <-- Import cache

const router = express.Router();

/**
 * GET /api/brands
 * Returns a list of all brands (name, logoUrl, country)
 */
router.get("/", async (req, res) => {
  const cachedBrands = cache.get("brands");
  if (cachedBrands) {
    return res.json(cachedBrands);
  }

  try {
    const brands = await Brand.find()
      .sort("name")
      .select("name logoUrl country");

    cache.set("brands", brands); // Cache the result
    res.json(brands);
  } catch (err) {
    console.error("❌ Error fetching brands:", err);
    res.status(500).json({ message: "Could not fetch brands." });
  }
});

export default router;
