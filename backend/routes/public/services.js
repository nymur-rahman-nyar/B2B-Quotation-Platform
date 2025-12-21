import express from "express";
import Service from "../../models/Service.js";
import cache from "../../utils/cache.js"; // Import cache

const router = express.Router();

router.get("/", async (req, res) => {
  const cachedServices = cache.get("services_all");
  if (cachedServices) {
    return res.json(cachedServices);
  }

  try {
    const all = await Service.find().sort({ createdAt: -1 });
    cache.set("services_all", all); // Cache the result
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
