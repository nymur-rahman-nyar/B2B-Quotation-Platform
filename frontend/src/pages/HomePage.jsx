import React from "react";
import BackgroundHalo from "../components/BackgroundHalo";
import HeroSection from "../components/HeroSection";
import HeroActions from "../components/HeroActions";
import PreviousWorksSection from "../components/PreviousWorksSection";
import SupportSection from "../components/SupportSection";

const HomePage = () => (
  <div className="relative min-h-screen text-white">
    <BackgroundHalo />

    {/* Add padding to avoid overlap with fixed navbar */}
    <div className="pt-0 flex flex-col items-center justify-center">
      <HeroSection />
      <HeroActions />
      <PreviousWorksSection />
      <SupportSection />
    </div>
  </div>
);

export default HomePage;
