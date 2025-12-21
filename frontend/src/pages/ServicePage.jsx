// src/pages/ServicesPage.jsx
import React from "react";
import ServicesPageMobile from "./ServicesPageMobile";
import ServicesPageDesktop from "./ServicesPageDesktop";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ServicesPage() {
  return (
    <>
      <ServicesPageMobile apiBase={API} />
      <ServicesPageDesktop apiBase={API} />
    </>
  );
}
