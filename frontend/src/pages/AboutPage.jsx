// src/pages/AboutPage.jsx
import React, { useState, useEffect } from "react";
import AboutPageDesktop from "./AboutPageDesktop";
import AboutPageMobile from "./AboutPageMobile";

// pull in your base-URL from Vite
const API = import.meta.env.VITE_API_BASE_URL;

export default function AboutPage() {
  // --- data state ---
  const [about, setAbout] = useState({ title: "", content: "" });
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- layout switch state ---
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    // fetch About data once
    fetch(`${API}/api/about`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAbout(data.about || data);
        setBrands(data.brands || []);
        setClients(data.clients || []);
        setTestimonials(data.testimonials || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load About Us data.");
      })
      .finally(() => setLoading(false));

    // listen for viewport changes
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // props to pass down
  const commonProps = { about, brands, clients, testimonials, loading, error };

  return isDesktop ? (
    <AboutPageDesktop {...commonProps} />
  ) : (
    <AboutPageMobile {...commonProps} />
  );
}
