// File: src/pages/PublicProjectsPage.jsx
import React, { useEffect, useState } from "react";
import PublicProjectsPageDesktop from "./PublicProjectsPageDesktop";
import PublicProjectsPageMobile from "./PublicProjectsPageMobile";

// pull in your base-URL from Vite
const API = import.meta.env.VITE_API_BASE_URL;

export default function PublicProjectsPage() {
  // --- data state ---
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- layout switch state ---
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // fetch Projects data once
  useEffect(() => {
    fetch(`${API}/api/projects`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setFiltered(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load projects.");
      })
      .finally(() => setLoading(false));
  }, []);

  // filter on searchTerm
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    setFiltered(
      term
        ? projects.filter(
            (p) =>
              p.title.toLowerCase().includes(term) ||
              (p.description || "").toLowerCase().includes(term)
          )
        : projects
    );
  }, [searchTerm, projects]);

  // listen for viewport changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // helper
  const truncate = (str, max = 200) =>
    str && str.length > max ? str.slice(0, max) + "…" : str;

  // props to pass down
  const commonProps = {
    projects: filtered,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    truncate,
  };

  return isDesktop ? (
    <PublicProjectsPageDesktop {...commonProps} />
  ) : (
    <PublicProjectsPageMobile {...commonProps} />
  );
}
