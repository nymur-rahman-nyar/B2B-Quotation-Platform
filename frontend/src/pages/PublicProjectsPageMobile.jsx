import React from "react";
import { Link } from "react-router-dom";
import BackgroundHalo from "../components/BackgroundHalo";

export default function PublicProjectsPageMobile({
  projects,
  searchTerm,
  setSearchTerm,
  loading,
  error,
  truncate,
}) {
  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#505374]" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error loading projects: {error}
      </div>
    );

  return (
    <div className="pt-20 relative py-8 overflow-hidden">
      <BackgroundHalo />
      <section className="relative max-w-md mx-auto px-4 text-white">
        <h1 className="text-2xl font-extrabold mb-4 text-center">
          Our Projects
        </h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#505374]"
          />
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-gray-200">No projects found.</p>
        ) : (
          <div className="space-y-6">
            {projects.map((proj) => (
              <Link
                key={proj._id}
                to={`/projects/${proj._id}`}
                className="block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >
                {proj.imageUrl && (
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="object-cover w-full h-full transform hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white mb-1">
                    {proj.title}
                  </h2>
                  <p className="text-gray-200 text-sm">
                    {truncate(proj.description || "No description provided.")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
