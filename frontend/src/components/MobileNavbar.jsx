// src/components/MobileNavbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import smallLogo from "../assets/nav_bar/damodor_logo_mini.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contacts" },
  { label: "Quote", to: "/request-quote" },
];

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="md:hidden bg-white fixed w-full top-0 z-50 shadow transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        <NavLink to="/">
          <img src={smallLogo} alt="Damodor Logo" className="h-10" />
        </NavLink>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-2xl focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <ul className="flex flex-col bg-white border-t border-gray-200 px-4 pb-4 space-y-2">
          {navItems.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `block py-2 tracking-wide text-base transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 hover:text-gray-600"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default MobileNavbar;
