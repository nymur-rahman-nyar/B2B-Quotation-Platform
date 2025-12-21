// src/components/SupportSectionDesktop.jsx
import React from "react";
import { Link } from "react-router-dom";
import supportIcon from "../assets/home_page/customer_support_icon.png";

const SupportSectionDesktop = () => (
  <section className="hidden md:block w-full bg-transparent text-white pt-16 pb-24 px-6 md:px-16">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Left: Text & Button */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 pr-45">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            Say Hello!
          </h2>
          <p className="text-gray-300 text-sm">
            We usually get back within 2 hours!
          </p>
          <Link
            to="/contacts"
            className="inline-block bg-white text-black px-6 py-2 text-sm font-medium rounded shadow hover:bg-gray-100 transition"
          >
            Customer Support
          </Link>
        </div>

        {/* Right: Icon with halo */}
        <div className="relative flex justify-center md:justify-start">
          {/* halo just behind the icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              className="
                block
                w-[130px] md:w-[180px]
                h-[130px] md:h-[180px]
                bg-white rounded-full
                opacity-30 blur-2xl
              "
            />
          </div>

          <img
            src={supportIcon}
            alt="Customer Support Icon"
            className="w-[130px] md:w-[180px] select-none pointer-events-none relative z-10"
            draggable="false"
          />
        </div>
      </div>
    </div>
  </section>
);

export default SupportSectionDesktop;
