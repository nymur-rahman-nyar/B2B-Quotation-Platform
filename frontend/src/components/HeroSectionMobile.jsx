// src/components/HeroSectionMobile.jsx
import React from "react";
import heroIcon from "../assets/home_page/damodor_welcome_image.png";

const HeroSectionMobile = () => (
  <section className="pt-25 md:hidden w-full bg-transparent text-white py-7 px-6">
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-center">Welcome!</h1>
      <p className="text-base leading-relaxed text-gray-200 text-center max-w-sm">
        To Damodor Enterprise, a leading importer, exporter, engineering and IT
        service provider in Bangladesh. Established in 2019.
      </p>
      <div className="relative">
        <div className="absolute w-48 h-48 bg-white blur-[60px] opacity-30 -z-10 inset-0 m-auto rounded-full" />
        <img
          src={heroIcon}
          alt="Hero Icon"
          className="w-72 select-none pointer-events-none mx-auto"
          draggable="false"
        />
      </div>
    </div>
  </section>
);

export default HeroSectionMobile;
