// src/components/PreviousWorksSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import weldingImage from "../assets/home_page/welding_image.png";

const PreviousWorksSection = () => {
  return (
    <section className="w-full bg-transparent text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Left: image + halo */}
        <div className="relative flex justify-center md:justify-end">
          <div className="absolute inset-0 flex items-center justify-center md:justify-end -z-10">
            <span className="block w-[180px] h-[180px] bg-white rounded-full opacity-30 blur-2xl" />
          </div>
          <img
            src={weldingImage}
            alt="Example of previous welding work"
            draggable="false"
            className="w-[160px] md:w-[220px] select-none pointer-events-none"
          />
        </div>

        {/* Right: text + button */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            Our Previous Works
          </h2>
          <p className="text-gray-300 text-sm">
            We’re proud to share some of our past projects—see how we’ve helped
            other customers.
          </p>
          <Link
            to="/projects"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-block border border-white px-6 py-3 text-white text-sm rounded hover:bg-white hover:text-black transition duration-300"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PreviousWorksSection;
