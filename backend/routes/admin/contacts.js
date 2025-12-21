import express from "express";
import Contact from "../../models/Contact.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Contact.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new contact entry
router.post("/", async (req, res) => {
  try {
    const {
      address,
      phone,
      email,
      extra = "",
      methods = [], // <-- grab methods from body (default to empty array)
    } = req.body;

    const contact = new Contact({
      address,
      phone,
      email,
      extra,
      methods, // <-- include methods in the document
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update existing
router.put("/:id", async (req, res) => {
  try {
    const {
      address,
      phone,
      email,
      extra = "",
      methods = [], // <-- grab updated methods
    } = req.body;

    const updates = {
      address,
      phone,
      email,
      extra,
      methods, // <-- include methods in update
    };

    const contact = await Contact.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!contact) return res.status(404).json({ error: "Not found" });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a contact
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Contact.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
