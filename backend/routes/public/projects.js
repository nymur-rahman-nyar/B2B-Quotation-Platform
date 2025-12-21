import express from "express";
import Project from "../../models/Project.js";
import cache from "../../utils/cache.js"; // Import cache

const router = express.Router();

// GET /api/projects — return all projects in descending date order
router.get("/", async (req, res) => {
  const cachedProjects = cache.get("projects_all");
  if (cachedProjects) {
    return res.json(cachedProjects);
  }

  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    cache.set("projects_all", projects); // Cache the full list
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — single project
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cacheKey = `project_${id}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const proj = await Project.findById(id);
    if (!proj) return res.status(404).json({ error: "Not found" });

    cache.set(cacheKey, proj); // Cache single project
    res.json(proj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
