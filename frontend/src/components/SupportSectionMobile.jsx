// src/components/SupportSectionMobile.jsx
import React from "react";
import { Link } from "react-router-dom";
import supportIcon from "../assets/home_page/customer_support_icon.png";

const SupportSectionMobile = () => (
  <section className="md:hidden w-full bg-transparent text-white pt-16 pb-24 px-6">
    <div className="flex flex-col items-center text-center space-y-6">
      {/* Icon + halo on top */}
      <div className="relative">
        <span
          className="
            block
            w-[130px]
            h-[130px]
            bg-white
            rounded-full
            opacity-30
            blur-2xl
            absolute
            inset-0
            m-auto
          "
        />
        <img
          src={supportIcon}
          alt="Customer Support Icon"
          className="w-[130px] select-none pointer-events-none relative z-10"
          draggable="false"
        />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-semibold leading-snug">Say Hello!</h2>

      {/* Subtext */}
      <p className="text-gray-300 text-sm">
        We usually get back within 2 hours!
      </p>

      {/* Button below */}
      <Link
        to="/contacts"
        className="inline-block bg-white text-black px-6 py-2 text-sm font-medium rounded shadow hover:bg-gray-100 transition"
      >
        Customer Support
      </Link>
    </div>
  </section>
);

export default SupportSectionMobile;
