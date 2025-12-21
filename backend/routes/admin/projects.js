// src/routes/admin/projects.js
import express from "express";
import multer from "multer";
import path from "path";
import Project from "../../models/Project.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Protect all routes
router.use(authenticateToken);

// GET /api/admin/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    res.json(proj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/projects
// Accepts JSON body.imageUrl OR multipart form 'image' file
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, link, imageUrl: bodyUrl } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : bodyUrl || "";
    const proj = new Project({ title, description, link, imageUrl });
    await proj.save();
    res.status(201).json(proj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/projects/:id
// Accepts JSON body.imageUrl OR multipart form 'image' file
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, link, imageUrl: bodyUrl } = req.body;
    const updates = { title, description, link };
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    } else if (bodyUrl !== undefined) {
      updates.imageUrl = bodyUrl;
    }
    const proj = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!proj) return res.status(404).json({ error: "Not found" });
    res.json(proj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    const proj = await Project.findByIdAndDelete(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
