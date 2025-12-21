import express from "express";
import multer from "multer";
import path from "path";
import Product from "../../models/Product.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();

// Multer setup for optional image file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Utility to normalize packingSizes
function parsePackingSizes(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch {
      // fallback: comma‑separated
      return input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

// Utility to generate slug from brand + name
function generateSlug(brand, name) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET all products (with auth)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find().sort("-createdAt");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        code,
        brand,
        description,
        countryOfOrigin,
        documentUrl,
        imageUrl: bodyImageUrl,
        slug: customSlug,
      } = req.body;

      const packingSizes = parsePackingSizes(req.body.packingSizes);

      const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : bodyImageUrl || "";

      const slug = customSlug || generateSlug(brand, name);

      const product = await Product.create({
        name,
        code,
        brand,
        description,
        countryOfOrigin,
        imageUrl,
        documentUrl: documentUrl || "",
        packingSizes,
        slug,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT update product
router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      // 1) load the existing doc
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: "Not found" });

      // 2) apply incoming fields
      const {
        name,
        code,
        brand,
        description,
        countryOfOrigin,
        documentUrl,
        slug: customSlug,
      } = req.body;

      if (name !== undefined) product.name = name;
      if (code !== undefined) product.code = code;
      if (brand !== undefined) product.brand = brand;
      if (description !== undefined) product.description = description;
      if (countryOfOrigin !== undefined)
        product.countryOfOrigin = countryOfOrigin;
      if (documentUrl !== undefined) product.documentUrl = documentUrl;

      // image upload wins over body.imageUrl
      if (req.file) {
        product.imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.imageUrl !== undefined) {
        product.imageUrl = req.body.imageUrl;
      }

      // packingSizes
      if (req.body.packingSizes !== undefined) {
        product.packingSizes = parsePackingSizes(req.body.packingSizes);
      }

      // 3) slug logic: customSlug if provided, otherwise generate if missing or name/brand changed
      if (customSlug) {
        product.slug = customSlug;
      } else if (!product.slug || name || brand) {
        product.slug = generateSlug(product.brand, product.name);
      }

      // 4) save (this will persist the slug on older docs)
      const updated = await product.save();
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE product
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
