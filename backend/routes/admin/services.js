// routes/admin/services.js
import express from "express";
import Service from "../../models/Service.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();

// GET /api/admin/services
router.get("/", authenticateToken, async (req, res) => {
  try {
    const list = await Service.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/services
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const svc = new Service({ name, description });
    await svc.save();
    res.status(201).json(svc);
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/services/:id
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const svc = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!svc) return res.status(404).json({ error: "Service not found" });
    res.json(svc);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/services/:id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const svc = await Service.findByIdAndDelete(req.params.id);
    if (!svc) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
