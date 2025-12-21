// src/pages/PublicContactsPageDesktop.jsx
import React, { useState, useEffect } from "react";
import GradientBackground from "../components/GradientBackground";

export default function PublicContactsPageDesktop({ apiBase }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/api/contacts`);
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load contacts");
        }
        setContacts(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <GradientBackground />

      <div className="hidden md:block container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Contact Information
        </h1>

        {loading ? (
          <p className="text-white">Loading contacts…</p>
        ) : error ? (
          <p className="text-red-300">Error: {error}</p>
        ) : (
          <div className="space-y-8">
            {contacts.map((c) => (
              <div key={c._id} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-2">{c.address}</h2>
                <p className="mb-1">
                  <strong>Phone:</strong> {c.phone}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${c.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {c.email}
                  </a>
                </p>
                {c.extra && (
                  <p className="mb-2">
                    <strong>Extra:</strong> {c.extra}
                  </p>
                )}
                {c.methods?.length > 0 && (
                  <div>
                    <strong>Connect with us:</strong>
                    <ul className="mt-2 flex flex-wrap gap-4">
                      {c.methods.map((m, i) => (
                        <li key={i}>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            {m.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
