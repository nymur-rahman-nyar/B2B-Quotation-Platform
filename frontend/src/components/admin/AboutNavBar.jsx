// src/components/admin/AboutNavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const BASE = "/admin/about";

export default function AboutNavBar() {
  return (
    <nav className="flex space-x-4 bg-gray-100 p-4 rounded mb-6">
      <NavLink
        to={BASE}
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-200"
          }`
        }
      >
        About Info
      </NavLink>
      <NavLink
        to={`${BASE}/clients`}
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-200"
          }`
        }
      >
        Clients
      </NavLink>
      <NavLink
        to={`${BASE}/testimonials`}
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-200"
          }`
        }
      >
        Testimonials
      </NavLink>
      <NavLink
        to={`${BASE}/brands`}
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-200"
          }`
        }
      >
        Brands
      </NavLink>
    </nav>
  );
}
