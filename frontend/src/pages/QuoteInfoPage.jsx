import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;
// Regex for Bangladeshi phone numbers: optional +88, then 01[3-9] followed by 8 digits
const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export default function QuoteInfoPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Load quote data from localStorage
  useEffect(() => {
    const svcList = JSON.parse(localStorage.getItem("service_list") || "[]");
    setServices(
      svcList.map((s) => ({
        id: s.id,
        name: s.name,
        query: s.additional_info || "",
      }))
    );

    const prodList = JSON.parse(localStorage.getItem("product_list") || "[]");
    setProducts(
      prodList.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        code: p.code,
        packingSizes: Array.isArray(p.packingSizes) ? p.packingSizes : [],
        items: Array.isArray(p.quantity) ? p.quantity : [],
        query: p.additional_info || "",
      }))
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((c) => ({ ...c, [name]: value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!contact.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!BD_PHONE_REGEX.test(contact.phone.trim())) {
      setError(
        "Please enter a valid Bangladeshi phone number in the format +8801XXXXXXXXX or 01XXXXXXXXX."
      );
      return;
    }

    setSending(true);

    // Prepare payload: include product even if no quantity selected
    const items = products.flatMap((p) => {
      const validItems = p.items.filter((it) => it.qty && it.qty !== "");
      if (validItems.length > 0) {
        return validItems.map((it) => ({
          id: p.id,
          packSize: it.size,
          quantity: it.qty,
          query: p.query,
        }));
      }
      return [
        {
          id: p.id,
          packSize: null,
          quantity: 0,
          query: p.query,
        },
      ];
    });

    const svcItems = services.map((s) => ({ id: s.id, query: s.query }));

    try {
      const res = await fetch(`${API}/api/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, services: svcItems, contact }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || res.statusText);
      }

      // Clear the quote lists on success
      localStorage.removeItem("service_list");
      localStorage.removeItem("product_list");
      setServices([]);
      setProducts([]);

      navigate("/thank-you");
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  // Build summary lines
  const serviceLines = services.map((s) => (
    <p key={s.id}>
      • Service: {s.name}
      {s.query && <em>: {s.query}</em>}
    </p>
  ));

  const productLines = products.flatMap((p) => {
    // Show at least the product name
    const validItems = p.items.filter((it) => it.qty && it.qty !== "");
    if (validItems.length > 0) {
      return validItems.map((it, i) => (
        <p key={`${p.id}-${i}`}>
          • {p.name} ({it.size || "single"}) × {it.qty}
          {p.query && <em>: {p.query}</em>}
        </p>
      ));
    }
    return [
      <p key={p.id}>
        • {p.name} (0)
        {p.query && <em>: {p.query}</em>}
      </p>,
    ];
  });

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Your Contact Info</h1>

      <div className="mb-6">
        <h2 className="font-semibold">Quote Summary</h2>
        {serviceLines}
        {productLines}
        {serviceLines.length === 0 && productLines.length === 0 && (
          <p className="italic text-gray-500">No items selected.</p>
        )}
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        {[
          { field: "name", label: "Name *" },
          { field: "email", label: "Email" },
          { field: "phone", label: "Phone *" },
          { field: "company", label: "Company" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type="text"
              name={field}
              value={contact[field]}
              onChange={handleChange}
              placeholder={
                field === "phone" ? "+8801XXXXXXXXX or 01XXXXXXXXX" : ""
              }
              required={field === "name" || field === "phone"}
              className="w-full border rounded p-2"
            />
            {field === "phone" && (
              <p className="text-sm text-gray-500">
                Must be a Bangladeshi number: +8801XXXXXXXXX or 01XXXXXXXXX
              </p>
            )}
          </div>
        ))}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {sending ? "Sending…" : "Send Quote"}
        </button>
      </form>
    </div>
  );
}
