// src/components/DesktopNavbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// Your “normal” big logo:
import largeLogo from "../assets/nav_bar/damodor_logo.svg";
// Your “thin” small logo:
import smallLogo from "../assets/nav_bar/damodor_logo_mini.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contacts" },
  { label: "Quote", to: "/request-quote" },
];

const DesktopNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between transition-all duration-300">
        {/* Swap src based on scroll state */}
        <NavLink to="/">
          <img
            src={isScrolled ? smallLogo : largeLogo}
            alt="Damodor Logo"
            className={`transition-all duration-300 ${
              isScrolled ? "h-10" : "h-18"
            }`}
          />
        </NavLink>

        {/* Always render nav items on desktop */}
        <ul className="hidden md:flex space-x-12">
          {navItems.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `tracking-wide text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-[#1E2859] hover:text-gray-500"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
