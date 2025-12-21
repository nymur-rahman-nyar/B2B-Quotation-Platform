// src/components/admin/AboutInfo.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

export default function AboutInfo() {
  const [about, setAbout] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/about`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAbout({ title: data.title, content: data.content });
      })
      .catch((err) => {
        console.error("Error loading admin About:", err);
        setError("Could not load About data.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAbout((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(about),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const updated = await res.json();
      setAbout({ title: updated.title, content: updated.content });
      setMessage("Saved successfully.");
    } catch (err) {
      console.error("Error saving About:", err);
      setMessage("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading about…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <p className="text-green-600">{message}</p>}

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={about.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Content (HTML)</label>
        <textarea
          name="content"
          value={about.content}
          onChange={handleChange}
          rows={10}
          className="w-full border px-3 py-2 rounded font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
