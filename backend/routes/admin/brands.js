// src/routes/admin/brands.js
import express from "express";
import Brand from "../../models/Brand.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET /api/admin/about/brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    return res.status(200).json(brands);
  } catch (err) {
    console.error("Error fetching Brands:", err);
    return res.status(500).json({ message: "Error fetching brands." });
  }
});

// POST /api/admin/about/brands
router.post("/", async (req, res) => {
  try {
    const { name, logoUrl, country } = req.body;
    const brand = new Brand({ name, logoUrl, country });
    await brand.save();
    return res.status(201).json(brand);
  } catch (err) {
    console.error("Error creating Brand:", err);
    return res.status(400).json({ message: "Invalid brand data." });
  }
});

// PUT /api/admin/about/brands/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body, // expects { name, logoUrl, country } or any subset
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Brand not found." });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating Brand:", err);
    return res.status(400).json({ message: "Invalid update data." });
  }
});

// DELETE /api/admin/about/brands/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Brand not found." });
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting Brand:", err);
    return res.status(500).json({ message: "Error deleting brand." });
  }
});

export default router;
