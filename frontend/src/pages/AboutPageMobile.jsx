import React from "react";
import AboutInfo from "../components/AboutInfo";
import BackgroundHalo from "../components/BackgroundHalo";

export default function AboutPageMobile({
  about,
  brands,
  clients,
  testimonials,
  loading,
  error,
}) {
  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-gray-200">
        <p className="text-base animate-pulse">Loading…</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-48 text-red-400">
        <p className="text-base">{error}</p>
      </div>
    );

  return (
    <div className="relative pt-20 py-8 text-gray-100 px-4">
      <BackgroundHalo />

      {/* About */}
      <section className="mb-12">
        <AboutInfo
          title={about.title}
          content={about.content}
          className="prose prose-base text-gray-100"
        />
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Our Brands</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {brands.map((b) => (
              <div
                key={b._id}
                className="flex flex-col items-center p-3 bg-white rounded-lg shadow-md"
              >
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="h-12 object-contain mb-1"
                />
                <p className="text-sm font-medium" style={{ color: "#1B1C3B" }}>
                  {b.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clients */}
      {clients.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Our Clients</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {clients.map((c) => (
              <div
                key={c._id}
                className="flex flex-col items-center p-3 bg-white rounded-lg shadow-md"
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="h-16 object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    {c.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}

      {testimonials.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">What People Say</h2>

          {/* 1 column on mobile, 2 on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <blockquote
                key={t._id}
                className="p-4 bg-black bg-opacity-60 rounded-lg shadow-md text-sm"
              >
                <p>“{t.quote}”</p>
                <footer className="mt-2 text-xs text-gray-300">
                  — {t.author}
                  {t.company ? `, ${t.company}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
