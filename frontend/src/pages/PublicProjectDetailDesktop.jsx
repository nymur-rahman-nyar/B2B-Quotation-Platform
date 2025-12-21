// src/pages/PublicProjectDetailDesktop.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";

export default function PublicProjectDetailDesktop({
  project,
  loading,
  error,
}) {
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!project) return null;

  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center hover:text-gray-700 transition"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Projects
          </button>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          {project.imageUrl && (
            <div className="relative group h-96">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}

          <div className="p-8 flex flex-col justify-center space-y-6">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-gray-700 leading-relaxed">
                {project.description}
              </p>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
              >
                View Detailed Photos
                <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
