import React, { useState } from "react";

const BackgroundHalo = () => {
  const [clickHalos, setClickHalos] = useState([]);

  const handleClick = (e) => {
    const { clientX, clientY } = e;

    const newHalo = {
      id: Date.now(),
      x: clientX,
      y: clientY,
    };

    setClickHalos((prev) => [...prev, newHalo]);

    // Remove after animation
    setTimeout(() => {
      setClickHalos((prev) => prev.filter((h) => h.id !== newHalo.id));
    }, 3000);
  };

  return (
    <div
      className="fixed inset-0 -z-10 bg-[#0f112b] overflow-hidden"
      onClick={handleClick}
    >
      {/* Static left halo */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[200px] opacity-30" />

      {/* Static right halo */}
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[200px] opacity-30" />

      {/* Halos on click */}
      {clickHalos.map((halo) => (
        <div
          key={halo.id}
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-400 blur-[180px] opacity-50 animate-haloFade pointer-events-none"
          style={{
            top: halo.y - 200 + "px",
            left: halo.x - 200 + "px",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundHalo;
