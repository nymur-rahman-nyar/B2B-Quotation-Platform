import React from "react";
import AboutInfo from "../components/AboutInfo";
import BackgroundHalo from "../components/BackgroundHalo";

export default function AboutPageDesktop({
  about,
  brands,
  clients,
  testimonials,
  loading,
  error,
}) {
  const renderSlider = (items, renderItem) => (
    <div className="relative flex justify-center">
      <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4">
        {items.map(renderItem)}
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-200">
        <p className="text-lg animate-pulse">Loading…</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <p className="text-lg">{error}</p>
      </div>
    );

  return (
    <div className="relative py-12 overflow-hidden text-gray-100">
      <BackgroundHalo />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <section className="mb-16 text-center">
          <AboutInfo
            title={about.title}
            content={about.content}
            className="prose prose-lg text-gray-100 mx-auto"
          />
        </section>

        {/* Brands */}
        {brands.length > 0 && (
          <section className="mb-16 text-center">
            <h2 className="text-2xl font-semibold mb-6">Our Brands</h2>
            {renderSlider(brands, (b) => (
              <div
                key={b._id}
                className="snap-center flex-shrink-0 w-56 flex flex-col items-center p-4 bg-white rounded-lg shadow-lg"
              >
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="max-h-16 object-contain mb-2"
                />
                <h3
                  className="text-lg font-medium"
                  style={{ color: "#1B1C3B" }}
                >
                  {b.name}
                </h3>
                {b.country && (
                  <span className="text-sm" style={{ color: "#1B1C3B" }}>
                    {b.country}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Clients */}
        {clients.length > 0 && (
          <section className="mb-16 text-center">
            <h2 className="text-2xl font-semibold mb-6">Our Clients</h2>
            {renderSlider(clients, (c) => (
              <div
                key={c._id}
                className="snap-center flex-shrink-0 w-40 flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="h-24 w-auto object-contain"
                  />
                ) : (
                  <div className="h-24 flex items-center justify-center">
                    <span className="text-lg font-medium">{c.name}</span>
                  </div>
                )}
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {c.name}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="mb-16 text-center">
            <h2 className="text-2xl font-semibold mb-6">What People Say</h2>
            {renderSlider(testimonials, (t) => (
              <blockquote
                key={t._id}
                className="snap-center flex-shrink-0 min-w-[280px] bg-black bg-opacity-70 p-4 rounded-lg shadow-xl text-center"
              >
                <p className="text-sm leading-snug">“{t.quote}”</p>
                <footer className="mt-2 text-xs text-gray-300">
                  — {t.author}
                  {t.company ? `, ${t.company}` : ""}
                </footer>
              </blockquote>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
