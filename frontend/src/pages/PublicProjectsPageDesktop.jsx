import React from "react";
import { Link } from "react-router-dom";
import BackgroundHalo from "../components/BackgroundHalo";

export default function PublicProjectsPageDesktop({
  projects,
  searchTerm,
  setSearchTerm,
  loading,
  error,
  truncate,
}) {
  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#505374]" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center py-12">
        Error loading projects: {error}
      </div>
    );

  return (
    <div className="relative py-12 overflow-hidden">
      <BackgroundHalo />
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">
          Our Previous Projects
        </h1>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#505374]"
          />
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-gray-200">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <Link
                key={proj._id}
                to={`/projects/${proj._id}`}
                className="flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >
                {proj.imageUrl && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="object-cover w-full h-full transform hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {proj.title}
                  </h2>
                  <p className="text-gray-200 text-sm flex-grow">
                    {truncate(proj.description || "No description provided.")}
                  </p>
                  <button
                    type="button"
                    className="mt-4 self-start border border-white text-white px-4 py-2 rounded hover:bg-white/20 hover:text-white transition"
                  >
                    More
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
