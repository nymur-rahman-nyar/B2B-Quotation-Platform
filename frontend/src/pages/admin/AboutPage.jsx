// src/pages/admin/AboutPage.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AboutNavBar from "../../components/admin/AboutNavBar";

export default function AboutPageAdmin() {
  return (
    <>
      {/* Persistent navbar for all “About” sub-pages */}
      <AboutNavBar />

      {/* Nested content will render here */}
      <div className="p-6 bg-gray-50 rounded">
        <Outlet />
      </div>
    </>
  );
}
