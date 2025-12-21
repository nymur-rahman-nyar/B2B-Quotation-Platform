// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";

// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Couldn't find #root element in index.html");
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
