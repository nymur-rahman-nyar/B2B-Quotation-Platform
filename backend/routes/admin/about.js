// src/routes/admin/about.js
import express from "express";
import About from "../../models/About.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET /api/admin/about
router.get("/", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ title: "", content: "" });
    }
    return res.status(200).json(about);
  } catch (err) {
    console.error("Error fetching About:", err);
    return res.status(500).json({ message: "Error fetching About data." });
  }
});

// PUT /api/admin/about
router.put("/", async (req, res) => {
  try {
    const updated = await About.findOneAndUpdate(
      {},
      { title: req.body.title, content: req.body.content },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating About:", err);
    return res.status(400).json({ message: "Invalid About data." });
  }
});

export default router;
