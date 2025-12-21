// src/pages/PublicProjectDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PublicProjectDetailDesktop from "./PublicProjectDetailDesktop";
import PublicProjectDetailMobile from "./PublicProjectDetailMobile";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PublicProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // fetch once
  useEffect(() => {
    fetch(`${API}/api/projects/${id}`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load project.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // track viewport
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const common = { project, loading, error };

  return isDesktop ? (
    <PublicProjectDetailDesktop {...common} />
  ) : (
    <PublicProjectDetailMobile {...common} />
  );
}
