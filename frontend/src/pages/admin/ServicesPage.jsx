// src/pages/admin/Services.jsx
import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch";
import { API_BASE } from "../../utils/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // fetch services
  const loadServices = async () => {
    try {
      const data = await authFetch(`${API_BASE}/api/admin/services`);
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load services", err);
      alert("Could not load services");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // open blank form
  const openAddForm = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setShowForm(true);
  };

  // open form with data
  const openEditForm = (svc) => {
    setForm({ name: svc.name || "", description: svc.description || "" });
    setEditingId(svc._id);
    setShowForm(true);
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API_BASE}/api/admin/services/${editingId}`
        : `${API_BASE}/api/admin/services`;
      const method = editingId ? "PUT" : "POST";

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setShowForm(false);
      loadServices();
    } catch (err) {
      console.error("Error saving service", err);
      alert("Error saving service");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await authFetch(`${API_BASE}/api/admin/services/${id}`, {
        method: "DELETE",
      });
      loadServices();
    } catch (err) {
      console.error("Error deleting service", err);
      alert("Error deleting service");
    }
  };

  return (
    <div className="p-4">
      {/* header + add button */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Services</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Service
        </button>
      </div>

      {/* form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>
          </div>

          <div className="mt-4 space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? "Update Service" : "Create Service"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {["Name", "Description", "Actions"].map((h) => (
              <th key={h} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc._id} className="border-t">
              <td className="px-4 py-2">{svc.name}</td>
              <td className="px-4 py-2">{svc.description}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => openEditForm(svc)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(svc._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
