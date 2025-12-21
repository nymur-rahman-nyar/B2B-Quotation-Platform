// src/pages/ProductsPage.jsx
import React from "react";
import ProductsPageMobile from "./ProductsPageMobile";
import ProductsPageDesktop from "./ProductsPageDesktop";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ProductsPage() {
  return (
    <>
      <ProductsPageMobile apiBase={API} />
      <ProductsPageDesktop apiBase={API} />
    </>
  );
}
