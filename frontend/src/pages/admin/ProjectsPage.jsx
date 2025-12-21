// src/pages/admin/ProjectsPage.jsx
import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch";
import { API_BASE } from "../../utils/api";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all projects from the backend
  const loadProjects = async () => {
    try {
      const data = await authFetch(`${API_BASE}/api/admin/projects`);
      if (Array.isArray(data)) setProjects(data);
      else setProjects([]);
    } catch (err) {
      console.error(err);
      alert("Could not load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Show blank form to add a project
  const openAddForm = () => {
    setForm({ title: "", description: "", link: "", imageUrl: "" });
    setEditingId(null);
    setShowForm(true);
  };

  // Show populated form to edit an existing project
  const openEditForm = (proj) => {
    setForm({
      title: proj.title || "",
      description: proj.description || "",
      link: proj.link || "",
      imageUrl: proj.imageUrl || "",
    });
    setEditingId(proj._id);
    setShowForm(true);
  };

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Submit create or update request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };

    const url = editingId
      ? `${API_BASE}/api/admin/projects/${editingId}`
      : `${API_BASE}/api/admin/projects`;
    const method = editingId ? "PUT" : "POST";

    try {
      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setShowForm(false);
      loadProjects();
    } catch (err) {
      console.error(err);
      alert("Error saving project");
    }
  };

  // Delete a project
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await authFetch(`${API_BASE}/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      loadProjects();
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Previous Projects</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-white rounded shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Link</label>
              <input
                type="url"
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <FaSave /> {editingId ? "Update Project" : "Create Project"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      )}

      <table className="w-full table-auto bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            {["Title", "Description", "Link", "Image", "Actions"].map((h) => (
              <th key={h} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
            <tr key={proj._id} className="border-t">
              <td className="px-4 py-2">{proj.title}</td>
              <td className="px-4 py-2">{proj.description}</td>
              <td className="px-4 py-2">
                {proj.link ? (
                  <a
                    href={proj.link}
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
              <td className="px-4 py-2">
                {proj.imageUrl ? (
                  <a
                    href={`${API_BASE}${proj.imageUrl}`}
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
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => openEditForm(proj)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(proj._id)}
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
