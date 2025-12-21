import React from "react";

/**
 * A full-screen dark background with soft colored halos.
 *
 * Usage: <GradientBackground />
 */
const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f112b]">
    {/* Left blue halo */}
    <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-400" />
    {/* Right purple halo */}
    <div className="absolute bottom-1/5 right-1/5 w-80 h-80 rounded-full blur-2xl opacity-15 bg-purple-400" />
    {/* Top-right cyan halo */}
    <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-2xl opacity-10 bg-cyan-400" />
  </div>
);

export default GradientBackground;
