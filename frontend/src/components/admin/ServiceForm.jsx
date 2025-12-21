// src/components/admin/ServiceForm.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

export default function ServiceForm({
  onAdded, // ← renamed callback
  existingService = null,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Pre‑fill when editing, or clear for new
  useEffect(() => {
    if (existingService) {
      setName(existingService.name);
      setDescription(existingService.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [existingService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = existingService
      ? `${API_BASE}/api/admin/services/${existingService._id}`
      : `${API_BASE}/api/admin/services`;
    const method = existingService ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        return alert(data.error || "Something went wrong.");
      }
      onAdded(); // notify parent to refresh list
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Network error, try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>{existingService ? "Edit Service" : "New Service"}</h3>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
      </div>
      <button type="submit" style={{ marginRight: 8 }}>
        {existingService ? "Update" : "Create"}
      </button>
      {existingService && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
