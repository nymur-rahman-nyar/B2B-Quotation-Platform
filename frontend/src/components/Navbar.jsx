// src/components/Navbar/Navbar.jsx
import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => (
  <>
    <div className="hidden md:block">
      <DesktopNavbar />
    </div>
    <div className="md:hidden">
      <MobileNavbar />
    </div>
  </>
);

export default Navbar;
