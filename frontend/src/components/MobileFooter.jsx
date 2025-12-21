// src/components/MobileFooter.jsx
import React from "react";

const MobileFooter = () => (
  <footer className="md:hidden bg-gray-100 py-6 mt-auto">
    <div className="px-4 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} Damodor. All rights reserved.</p>
      <div className="mt-2">
        <a
          href="https://www.linkedin.com/in/nymur-rahman-n-24b9ba265/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Developed by Nymur Rahman Nyar
        </a>
      </div>
    </div>
  </footer>
);

export default MobileFooter;
