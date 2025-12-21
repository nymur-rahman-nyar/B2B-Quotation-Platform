// src/components/Footer/Footer.jsx
import React from "react";
import DesktopFooter from "./DesktopFooter";
import MobileFooter from "./MobileFooter";

const Footer = () => (
  <>
    <div className="hidden md:block">
      <DesktopFooter />
    </div>
    <div className="md:hidden">
      <MobileFooter />
    </div>
  </>
);

export default Footer;
