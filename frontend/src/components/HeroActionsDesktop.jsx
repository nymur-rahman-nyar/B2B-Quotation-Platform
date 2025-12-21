// src/components/HeroActionsDesktop.jsx
import React from "react";
import { Link } from "react-router-dom";

const actions = [
  { text: "View Products", to: "/products" },
  { text: "View Services", to: "/services" },
  { text: "About Company", to: "/about" },
];

const HeroActionsDesktop = () => (
  <div className="hidden md:flex w-full py-12 bg-transparent justify-center">
    <div className="flex flex-row justify-center gap-8">
      {actions.map(({ text, to }) => (
        <Link
          key={text}
          to={to}
          className="group flex flex-col justify-center items-center bg-white text-black px-8 py-4 text-sm tracking-wide rounded-lg shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="font-medium">{text}</span>
          <span className="mt-1 h-[1px] bg-black w-8 group-hover:w-full transition-all duration-300" />
        </Link>
      ))}
    </div>
  </div>
);

export default HeroActionsDesktop;
