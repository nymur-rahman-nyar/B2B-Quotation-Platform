import express from "express";
import mongoose from "mongoose";
import Product from "../../models/Product.js";
import { query, validationResult } from "express-validator";
import cache from "../../utils/cache.js"; // <-- Import cache

const router = express.Router();

// Helper to escape user input for use in a RegExp
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/products?page=1&limit=10&search=foo&brand=FooBar
router.get(
  "/",
  [
    query("page")
      .optional()
      .toInt()
      .isInt({ min: 1 })
      .withMessage("`page` must be an integer ≥ 1"),

    query("limit")
      .optional()
      .toInt()
      .isInt({ min: 1, max: 100 })
      .withMessage("`limit` must be an integer between 1 and 100"),

    query("search")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage("`search` must be at most 50 characters"),

    query("brand")
      .optional({ checkFalsy: true })
      .trim()
      .isString()
      .withMessage("`brand` must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const skip = (page - 1) * limit;
    const filter = {};

    const hasFilter = req.query.search || req.query.brand;

    if (req.query.search) {
      const safe = escapeRegex(req.query.search);
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { code: { $regex: safe, $options: "i" } },
        { brand: { $regex: safe, $options: "i" } },
      ];
    }

    if (req.query.brand) {
      const safeBrand = escapeRegex(req.query.brand);
      filter.brand = { $regex: `^${safeBrand}$`, $options: "i" };
    }

    // Generate dynamic cache key
    const cacheKey = `products_${page}_${limit}_${req.query.search || ""}_${
      req.query.brand || ""
    }`;

    // Only use cache for default no-filtered homepage view
    if (!hasFilter && page === 1 && limit === 12) {
      const cached = cache.get("products_default");
      if (cached) return res.json(cached);
    }

    try {
      const [products, total] = await Promise.all([
        Product.find(filter).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
      ]);

      const response = { products, total, page, limit };

      if (!hasFilter && page === 1 && limit === 12) {
        cache.set("products_default", response); // Cache only default result
      }

      return res.json(response);
    } catch (err) {
      console.error("❌ Error in public GET /api/products:", err);
      return res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/products/:param
router.get("/:param", async (req, res) => {
  const raw = req.params.param;
  const param = decodeURIComponent(raw).toLowerCase();
  console.log("🔍 lookup param:", raw, "→", param);

  const cacheKey = `product_${param}`;
  const cachedProduct = cache.get(cacheKey);
  if (cachedProduct) {
    return res.json({ product: cachedProduct });
  }

  let product = null;

  if (mongoose.Types.ObjectId.isValid(param)) {
    product = await Product.findById(param).lean();
  }
  if (!product) {
    product = await Product.findOne({
      slug: new RegExp(`^${param}$`, "i"),
    }).lean();
  }
  if (!product) {
    console.warn("⚠️ Product not found for", param);
    return res.status(404).json({ message: "Product not found" });
  }

  cache.set(cacheKey, product); // Cache individual product detail

  return res.json({ product });
});

export default router;
