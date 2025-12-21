// src/pages/admin/Products.jsx
import React, { useState, useEffect, useMemo } from "react";
import { authFetch } from "../../utils/authFetch";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    code: "",
    brand: "",
    description: "",
    countryOfOrigin: "",
    imageUrl: "",
    documentUrl: "",
    packingSizes: [],
    slug: "",
  });
  const [newSize, setNewSize] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const loadProducts = () => {
    authFetch("/api/admin/products")
      .then((data) => setProducts(data))
      .catch(console.error);
  };
  useEffect(loadProducts, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // filter & sort
  const displayed = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let filtered = products.filter((p) =>
      [p.name, p.code, p.brand].some((val) => val.toLowerCase().includes(term))
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        const cmp = aVal
          .toString()
          .localeCompare(bVal.toString(), undefined, { numeric: true });
        return sortConfig.direction === "ascending" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [products, searchTerm, sortConfig]);

  const openAddForm = () => {
    setForm({
      name: "",
      code: "",
      brand: "",
      description: "",
      countryOfOrigin: "",
      imageUrl: "",
      documentUrl: "",
      packingSizes: [],
      slug: "",
    });
    setNewSize("");
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (p) => {
    setForm({
      name: p.name || "",
      code: p.code || "",
      brand: p.brand || "",
      description: p.description || "",
      countryOfOrigin: p.countryOfOrigin || "",
      imageUrl: p.imageUrl || "",
      documentUrl: p.documentUrl || "",
      packingSizes: p.packingSizes || [],
      slug: p.slug || "",
    });
    setNewSize("");
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddSize = () => {
    const val = newSize.trim();
    if (!val) return;
    setForm((f) => ({ ...f, packingSizes: [...f.packingSizes, val] }));
    setNewSize("");
  };

  const handleRemoveSize = (idx) => {
    setForm((f) => ({
      ...f,
      packingSizes: f.packingSizes.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedSlug = form.slug;
    if (!updatedSlug) {
      updatedSlug = `${form.brand}-${form.name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((f) => ({ ...f, slug: updatedSlug }));
    }

    const formData = new FormData();
    Object.entries({ ...form, slug: updatedSlug }).forEach(([key, val]) => {
      formData.append(key, key === "packingSizes" ? JSON.stringify(val) : val);
    });

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";
      await authFetch(url, { method, body: formData });
      setShowForm(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await authFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, code or brand…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 border p-2 rounded mb-4"
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded space-y-4 bg-white"
        >
          {/* --- form fields unchanged --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Name", name: "name", required: true },
              { label: "Code", name: "code", required: true },
              { label: "Brand", name: "brand", required: true },
              {
                label: "Country of Origin",
                name: "countryOfOrigin",
                required: true,
              },
              {
                label: "Description",
                name: "description",
                textarea: true,
                required: false,
              },
              { label: "Image URL", name: "imageUrl" },
              { label: "Document URL", name: "documentUrl" },
            ].map((fld) => (
              <div key={fld.name}>
                <label className="block mb-1">{fld.label}</label>
                {fld.textarea ? (
                  <textarea
                    name={fld.name}
                    value={form[fld.name]}
                    onChange={handleChange}
                    className="w-full border p-2"
                  />
                ) : (
                  <input
                    type="text"
                    name={fld.name}
                    value={form[fld.name]}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required={fld.required}
                  />
                )}
              </div>
            ))}

            {/* Slug Field */}
            <div>
              <label className="block mb-1">Slug</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full border p-2"
                  placeholder="Auto‑generated or custom slug"
                />
                <button
                  type="button"
                  onClick={() => {
                    const generated = `${form.brand}-${form.name}`
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    setForm((f) => ({ ...f, slug: generated }));
                  }}
                  className="bg-gray-600 text-white px-3 rounded"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Packing Sizes */}
            <div className="md:col-span-2">
              <label className="block mb-1">Packing Sizes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.packingSizes.map((size, i) => (
                  <span
                    key={i}
                    className="flex items-center bg-gray-200 rounded-full px-2 py-1 text-sm"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(i)}
                      className="ml-1 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add size…"
                  className="flex-1 border rounded-l p-2"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="bg-blue-600 text-white px-4 rounded-r"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? "Update Product" : "Create Product"}
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

      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100">
            {[
              { label: "Name", key: "name" },
              { label: "Code", key: "code" },
              { label: "Brand", key: "brand" },
              { label: "Origin", key: "countryOfOrigin" },
              { label: "Image", key: "imageUrl" },
            ].map((col) => (
              <th
                key={col.key}
                onClick={() => requestSort(col.key)}
                className="px-4 py-2 text-left cursor-pointer select-none"
              >
                {col.label}
                {sortConfig.key === col.key &&
                  (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
              </th>
            ))}
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="px-4 py-2 whitespace-nowrap">{p.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{p.code}</td>
              <td className="px-4 py-2 whitespace-nowrap">{p.brand}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {p.countryOfOrigin}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {p.imageUrl ? (
                  <a
                    href={p.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap space-x-2">
                <button
                  onClick={() => openEditForm(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
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
