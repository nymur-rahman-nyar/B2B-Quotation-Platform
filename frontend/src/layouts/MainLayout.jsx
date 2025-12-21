// src/layouts/MainLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// MainLayout ensures the navbar does not overlap content by adding
// top padding equal to the maximum navbar height (scroll + non-scroll states).
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    {/* 
      Navbar max height ~= 
        (unscrolled) py-4 (2rem) + logo h-18 (4.5rem) 
        → total ~6.5rem
      So we use pt-28 (=7rem) to cover that safely.
    */}
    <main className="flex-grow pt-0 md:pt-28">{children}</main>

    <Footer />
  </div>
);

export default MainLayout;
