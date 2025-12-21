// src/components/HeroActionsMobile.jsx
import React from "react";
import { Link } from "react-router-dom";

const actions = [
  { text: "View Products", to: "/products" },
  { text: "View Services", to: "/services" },
  { text: "About Company", to: "/about" },
];

const HeroActionsMobile = () => (
  <div className="md:hidden w-full py-8 px-6 bg-transparent">
    <div className="flex flex-col gap-4">
      {actions.map(({ text, to }) => (
        <Link
          key={to}
          to={to}
          className="
            btn btn-primary             /* DaisyUI base */
            w-full                      /* full-width */
            text-lg font-semibold       /* bigger text */
            rounded-full                /* pill shape */
            px-6 py-3                   /* padding */
            shadow-lg                   /* deeper shadow */
            transform transition        /* enable transforms */
            duration-300 ease-out       /* smooth timing */
            hover:scale-105             /* pop on hover */
            hover:shadow-xl             /* stronger shadow */
            active:scale-95             /* nice press feedback */
            focus:outline-none          /* remove default outline */
            focus:ring-4 focus:ring-blue-300 /* custom focus ring */
          "
        >
          {text}
        </Link>
      ))}
    </div>
  </div>
);

export default HeroActionsMobile;
