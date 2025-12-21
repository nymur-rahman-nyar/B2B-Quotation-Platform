// src/components/admin/BrandsPanel.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

export default function BrandsPanel() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [country, setCountry] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/about/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch brands");
      setBrands(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = { name, logoUrl, country };
    try {
      const url = editingId
        ? `${API_BASE}/api/admin/about/brands/${editingId}`
        : `${API_BASE}/api/admin/about/brands`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save brand");
      // reset form & state
      setName("");
      setLogoUrl("");
      setCountry("");
      setEditingId(null);
      fetchBrands();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    setLogoUrl(brand.logoUrl || "");
    setCountry(brand.country || "");
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/about/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete brand");
      }
      fetchBrands();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Brands</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul className="mb-6">
        {brands.map((b) => (
          <li key={b._id} className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {b.logoUrl && (
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="h-8 w-8 object-contain mr-3"
                />
              )}
              <span>
                {b.name} <span className="text-gray-600">({b.country})</span>
              </span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(b)}
                className="text-blue-600 hover:underline mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b._id)}
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

        <div>
          <label className="block mb-1 font-medium">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId ? "Update Brand" : "Add Brand"}
        </button>
      </form>
    </div>
  );
}
