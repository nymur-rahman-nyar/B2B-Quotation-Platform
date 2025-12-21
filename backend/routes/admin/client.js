// src/routes/admin/clients.js
import express from "express";
import Client from "../../models/Client.js";
import authenticateToken from "../../middlewares/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET /api/admin/about/clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (err) {
    console.error("Error fetching Clients:", err);
    return res.status(500).json({ message: "Error fetching clients." });
  }
});

// POST /api/admin/about/clients
router.post("/", async (req, res) => {
  try {
    const client = new Client({
      name: req.body.name,
      logoUrl: req.body.logoUrl,
    });
    await client.save();
    return res.status(201).json(client);
  } catch (err) {
    console.error("Error creating Client:", err);
    return res.status(400).json({ message: "Invalid client data." });
  }
});

// PUT /api/admin/about/clients/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Client not found." });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating Client:", err);
    return res.status(400).json({ message: "Invalid update data." });
  }
});

// DELETE /api/admin/about/clients/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Client not found." });
    return res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting Client:", err);
    return res.status(500).json({ message: "Error deleting client." });
  }
});

export default router;
