// src/pages/PublicProjectDetailMobile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PublicProjectDetailMobile({ project, loading, error }) {
  const navigate = useNavigate();
  const bg = "bg-[#E6E6F0]";

  if (loading)
    return (
      <div className={`flex justify-center items-center h-screen ${bg}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#1A1F3B]" />
      </div>
    );

  if (error)
    return (
      <div className={`flex justify-center items-center h-screen ${bg}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!project) return null;

  return (
    <section className={`${bg} min-h-screen py-8 px-4 pt-20`}>
      <button
        onClick={() => navigate(-1)}
        className="inline-block mb-4 text-[#1A1F3B] hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {project.imageUrl && (
          <div className="h-64 w-full overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#1A1F3B] mb-3">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-gray-700 leading-snug mb-4">
              {project.description}
            </p>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-[#1A1F3B] text-white py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              View Photos
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
