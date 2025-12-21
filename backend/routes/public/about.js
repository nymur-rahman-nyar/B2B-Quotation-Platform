// File: src/routes/public/about.js
import express from "express";
import About from "../../models/About.js";
import Brand from "../../models/Brand.js";
import Client from "../../models/Client.js";
import Testimonial from "../../models/Testimonial.js";
import cache from "../../utils/cache.js"; // <-- Import the cache

const router = express.Router();

// GET /api/about
// Returns: { about, brands, clients, testimonials }
router.get("/", async (req, res) => {
  const cachedData = cache.get("about_page");
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // Ensure the singleton About document exists
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ title: "", content: "" });
    }

    // Fetch the other collections
    const [brands, clients, testimonials] = await Promise.all([
      Brand.find().sort({ name: 1 }),
      Client.find().sort({ name: 1 }),
      Testimonial.find().sort({ createdAt: -1 }),
    ]);

    const data = { about, brands, clients, testimonials };

    // Cache the result
    cache.set("about_page", data);

    res.json(data);
  } catch (err) {
    console.error("Error fetching About data:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
