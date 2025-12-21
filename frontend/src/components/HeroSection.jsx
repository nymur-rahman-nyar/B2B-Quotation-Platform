// src/components/HeroSection.jsx
import React from "react";
import HeroSectionMobile from "./HeroSectionMobile";
import HeroSectionDesktop from "./HeroSectionDesktop";

const HeroSection = () => (
  <>
    <HeroSectionMobile />
    <HeroSectionDesktop />
  </>
);

export default HeroSection;
