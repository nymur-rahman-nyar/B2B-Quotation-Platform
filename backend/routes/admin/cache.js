// routes/admin/cache.js
import express from "express";
import cache from "../../utils/cache.js";
import fetch from "node-fetch"; // make sure node-fetch is available for Node <18

const router = express.Router();

const BASE_URL =
  process.env.ORIGIN_URL ||
  "https://request-for-quote-system-web-app.onrender.com";

// View current cache keys + values
router.get("/", (req, res) => {
  const keys = cache.keys();
  const stats = keys.map((key) => ({
    key,
    value: cache.get(key),
  }));
  res.json(stats);
});

// Clear all cache
router.post("/clear", (req, res) => {
  cache.flushAll();
  res.json({ message: "Cache cleared." });
});

// Rebuild default cache keys
router.post("/rebuild", async (req, res) => {
  try {
    const [aboutRoute, productsRoute, servicesRoute, projectsRoute] =
      await Promise.all([
        fetch(`${BASE_URL}/api/about`).then((r) => r.json()),
        fetch(`${BASE_URL}/api/products`).then((r) => r.json()),
        fetch(`${BASE_URL}/api/services`).then((r) => r.json()),
        fetch(`${BASE_URL}/api/projects`).then((r) => r.json()),
      ]);

    cache.set("about_page", aboutRoute);
    cache.set("products_default", productsRoute);
    cache.set("services_all", servicesRoute);
    cache.set("projects_all", projectsRoute);

    res.json({ message: "Cache rebuilt successfully." });
  } catch (err) {
    console.error("Failed to rebuild cache", err);
    res.status(500).json({ error: "Rebuild failed." });
  }
});

export default router;
