// src/components/ContactForm.jsx
import React from "react";

export default function ContactForm({
  contact,
  onContactChange,
  contactErrors,
  captchaAnswer,
  onCaptchaChange,
  onBack,
  onSubmit,
  submitting,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="max-w-md mx-auto border p-6 rounded space-y-4 bg-white"
    >
      <h2 className="text-xl font-semibold mb-2">Your Contact Info</h2>

      <div>
        <label className="block mb-1">Name *</label>
        <input
          type="text"
          name="name"
          required
          value={contact.name}
          onChange={(e) => onContactChange("name", e.target.value)}
          className="w-full border-gray-300 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {contactErrors.name && (
          <p className="text-red-500 text-sm mt-1">{contactErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Phone *</label>
        <input
          type="tel"
          name="phone"
          required
          value={contact.phone}
          onChange={(e) => onContactChange("phone", e.target.value)}
          placeholder="e.g. 017XXXXXXXX"
          className="w-full border-gray-300 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {contactErrors.phone && (
          <p className="text-red-500 text-sm mt-1">{contactErrors.phone}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={(e) => onContactChange("email", e.target.value)}
          className="w-full border-gray-300 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1">Company</label>
        <input
          type="text"
          name="company"
          value={contact.company}
          onChange={(e) => onContactChange("company", e.target.value)}
          className="w-full border-gray-300 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1">Anti‑bot: What is 2 + 3? *</label>
        <input
          type="text"
          name="captcha"
          required
          value={captchaAnswer}
          onChange={(e) => onCaptchaChange(e.target.value)}
          className="w-full border-gray-300 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {contactErrors.captcha && (
          <p className="text-red-500 text-sm mt-1">{contactErrors.captcha}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-white ${
            submitting
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
