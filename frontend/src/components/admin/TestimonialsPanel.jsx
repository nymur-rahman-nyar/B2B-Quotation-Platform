// src/components/admin/TestimonialsPanel.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

export default function TestimonialsPanel() {
  const [testimonials, setTestimonials] = useState([]);
  const [company, setCompany] = useState("");
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/about/testimonials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = { company, author, quote };
    try {
      const url = editingId
        ? `${API_BASE}/api/admin/about/testimonials/${editingId}`
        : `${API_BASE}/api/admin/about/testimonials`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save testimonial");
      // reset form
      setCompany("");
      setAuthor("");
      setQuote("");
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setCompany(t.company);
    setAuthor(t.author);
    setQuote(t.quote);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/about/testimonials/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete testimonial");
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul className="mb-6">
        {testimonials.map((t) => (
          <li key={t._id} className="border p-4 mb-2 rounded">
            <p className="italic mb-1">"{t.quote}"</p>
            <p className="font-semibold">
              – {t.author}, <span className="text-gray-600">{t.company}</span>
            </p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(t)}
                className="text-blue-600 hover:underline mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
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
          <label className="block mb-1 font-medium">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Quote</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId ? "Update Testimonial" : "Add Testimonial"}
        </button>
      </form>
    </div>
  );
}
