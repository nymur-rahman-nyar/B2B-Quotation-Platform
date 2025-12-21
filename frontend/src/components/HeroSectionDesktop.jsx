// src/components/HeroSectionDesktop.jsx
import React from "react";
import heroIcon from "../assets/home_page/damodor_welcome_image.png";

const HeroSectionDesktop = () => (
  <section className="pt-5 hidden md:block w-full bg-transparent text-white py-10 px-32">
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
      {/* Left side text */}
      <div className="flex-none text-center">
        <h1 className="text-5xl font-bold mb-4 text-left">Welcome!</h1>
        <p className="text-lg leading-relaxed text-gray-200 max-w-lg mx-auto text-left">
          To Damodor Enterprise, a leading importer, exporter, engineering and
          IT service provider in Bangladesh. Established in 2019.
        </p>
      </div>

      {/* Right side image with halo */}
      <div className="relative flex-none">
        <div
          className="absolute w-[300px] h-[300px] bg-white blur-[90px] opacity-30 -z-10 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <img
          src={heroIcon}
          alt="Hero Icon"
          className="w-[400px] select-none pointer-events-none"
          draggable="false"
        />
      </div>
    </div>
  </section>
);

export default HeroSectionDesktop;
