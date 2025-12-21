// src/pages/ProductDetailPage.jsx
import React from "react";
import ProductDetailPageMobile from "./ProductDetailPageMobile";
import ProductDetailPageDesktop from "./ProductDetailPageDesktop";

export default function ProductDetailPage({ apiBase }) {
  return (
    <>
      <ProductDetailPageMobile apiBase={apiBase} />
      <ProductDetailPageDesktop apiBase={apiBase} />
    </>
  );
}
