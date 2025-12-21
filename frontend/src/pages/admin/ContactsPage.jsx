// src/pages/admin/ContactsPage.jsx
import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch";
import { API_BASE } from "../../utils/api";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";

const CONTACT_TYPES = [
  "Facebook",
  "WhatsApp",
  "Messenger",
  "Instagram",
  "LinkedIn",
  "Other",
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    extra: "",
    methods: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all contacts
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authFetch(`${API_BASE}/api/admin/contacts`);
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // When a contact is selected
  const handleSelect = (c) => {
    setError(null);
    setSelected(c);
    setForm({
      address: c.address,
      phone: c.phone,
      email: c.email,
      extra: c.extra || "",
      methods: c.methods || [],
    });
  };

  // Initialize new contact form
  const handleNew = () => {
    setError(null);
    setSelected(null);
    setForm({ address: "", phone: "", email: "", extra: "", methods: [] });
  };

  // Remove contact
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact entry?")) return;
    try {
      setError(null);
      await authFetch(`${API_BASE}/api/admin/contacts/${id}`, {
        method: "DELETE",
      });
      handleNew();
      await loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Contact method change
  const handleMethodChange = (i, field, value) => {
    setForm((f) => {
      const methods = [...f.methods];
      methods[i] = { ...methods[i], [field]: value };
      return { ...f, methods };
    });
  };

  const addMethod = () =>
    setForm((f) => ({ ...f, methods: [...f.methods, { name: "", url: "" }] }));
  const removeMethod = (i) =>
    setForm((f) => ({
      ...f,
      methods: f.methods.filter((_, idx) => idx !== i),
    }));

  // Submit create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const url = selected
        ? `${API_BASE}/api/admin/contacts/${selected._id}`
        : `${API_BASE}/api/admin/contacts`;
      const method = selected ? "PUT" : "POST";
      const saved = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // After saving, select the returned contact
      setSelected(saved);
      setForm({
        address: saved.address,
        phone: saved.phone,
        email: saved.email,
        extra: saved.extra || "",
        methods: saved.methods || [],
      });
      await loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen grid grid-cols-2 gap-6">
      {/* Contact List */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Contacts</h2>
          <button
            onClick={handleNew}
            className="flex items-center space-x-1 text-green-600 hover:text-green-800"
          >
            <FaPlus />
            <span>New</span>
          </button>
        </div>
        {contacts.length === 0 ? (
          <p className="text-gray-500">No contacts found.</p>
        ) : (
          <ul>
            {contacts.map((c) => (
              <li
                key={c._id}
                onClick={() => handleSelect(c)}
                className={`p-2 rounded cursor-pointer mb-2 hover:bg-gray-100 ${
                  selected && selected._id === c._id ? "bg-blue-100" : ""
                }`}
              >
                <p className="font-medium">{c.address}</p>
                <p className="text-sm text-gray-600">{c.phone}</p>
                {c.email && <p className="text-sm text-gray-600">{c.email}</p>}
                {c.methods && c.methods.length > 0 && (
                  <div className="mt-1 flex flex-wrap space-x-2">
                    {c.methods.map((m, idx) => (
                      <a
                        key={idx}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        {m.name}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail / Form */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {selected ? "Edit Contact" : "Add Contact"}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["address", "phone", "email", "extra"].map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium capitalize">
                {field}
              </label>
              {field === "extra" ? (
                <textarea
                  name="extra"
                  value={form.extra}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required={field !== "extra"}
                  className="w-full border p-2 rounded"
                />
              )}
            </div>
          ))}

          {/* Contact Methods */}
          <div>
            <h3 className="font-medium mb-2">Contact Methods</h3>
            {form.methods.map((m, i) => (
              <div key={i} className="flex items-center space-x-2 mb-2">
                <select
                  value={m.name}
                  onChange={(e) =>
                    handleMethodChange(i, "name", e.target.value)
                  }
                  className="border p-2 rounded"
                  required
                >
                  <option value="">Type…</option>
                  {CONTACT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="https://…"
                  value={m.url}
                  onChange={(e) => handleMethodChange(i, "url", e.target.value)}
                  className="flex-grow border p-2 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeMethod(i)}
                  className="text-red-500 p-1"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMethod}
              className="text-blue-600 hover:underline"
            >
              + Add method
            </button>
          </div>

          <div className="flex space-x-2 justify-end">
            {selected && (
              <button
                type="button"
                onClick={() => handleDelete(selected._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaSave />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
