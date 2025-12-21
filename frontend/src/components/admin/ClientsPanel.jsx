// src/components/admin/ClientsPanel.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

export default function ClientsPanel() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/about/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = { name, logoUrl };
    try {
      const url = editingId
        ? `${API_BASE}/api/admin/about/clients/${editingId}`
        : `${API_BASE}/api/admin/about/clients`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save client");
      setName("");
      setLogoUrl("");
      setEditingId(null);
      fetchClients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client._id);
    setName(client.name);
    setLogoUrl(client.logoUrl || "");
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/about/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete client");
      fetchClients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Clients</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul className="mb-6">
        {clients.map((client) => (
          <li
            key={client._id}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center">
              {client.logoUrl && (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="h-8 w-8 object-contain mr-3"
                />
              )}
              <span>{client.name}</span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(client)}
                className="text-blue-600 hover:underline mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(client._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Logo URL</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId ? "Update Client" : "Add Client"}
        </button>
      </form>
    </div>
  );
}
