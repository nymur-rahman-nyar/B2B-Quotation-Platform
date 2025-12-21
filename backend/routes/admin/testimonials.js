// src/routes/admin/testimonials.js
import express from "express";
import Testimonial from "../../models/Testimonial.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET /api/admin/about/testimonials
router.get("/", async (req, res) => {
  try {
    const list = await Testimonial.find();
    return res.status(200).json(list);
  } catch (err) {
    console.error("Error fetching Testimonials:", err);
    return res.status(500).json({ message: "Error fetching testimonials." });
  }
});

// POST /api/admin/about/testimonials
router.post("/", async (req, res) => {
  try {
    const tst = new Testimonial({
      company: req.body.company,
      author: req.body.author,
      quote: req.body.quote,
    });
    await tst.save();
    return res.status(201).json(tst);
  } catch (err) {
    console.error("Error creating Testimonial:", err);
    return res.status(400).json({ message: "Invalid testimonial data." });
  }
});

// PUT /api/admin/about/testimonials/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Testimonial not found." });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating Testimonial:", err);
    return res.status(400).json({ message: "Invalid update data." });
  }
});

// DELETE /api/admin/about/testimonials/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Testimonial not found." });
    return res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting Testimonial:", err);
    return res.status(500).json({ message: "Error deleting testimonial." });
  }
});

export default router;
