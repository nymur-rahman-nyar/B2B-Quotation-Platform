import express from "express";
import Contact from "../../models/Contact.js";
import cache from "../../utils/cache.js"; // <-- Import cache

const router = express.Router();

// GET /api/contacts → return all contacts
router.get("/", async (req, res) => {
  const cachedContacts = cache.get("contacts");
  if (cachedContacts) {
    return res.json(cachedContacts);
  }

  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    cache.set("contacts", contacts); // Cache result
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
