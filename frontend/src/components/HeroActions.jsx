// src/components/HeroActions.jsx
import React from "react";
import HeroActionsMobile from "./HeroActionsMobile";
import HeroActionsDesktop from "./HeroActionsDesktop";

const HeroActions = () => (
  <>
    <HeroActionsMobile />
    <HeroActionsDesktop />
  </>
);

export default HeroActions;
