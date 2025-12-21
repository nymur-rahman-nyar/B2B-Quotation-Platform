// src/pages/ProductDetailPageMobile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaFilePdf } from "react-icons/fa";

export default function ProductDetailPageMobile({ apiBase }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("product_list") || "[]");
    return new Set(stored.map((item) => item.id));
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/products/${slug}`);
        if (!res.ok) throw new Error("Failed to load product");
        const { product } = await res.json();
        setProduct(product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase, slug]);

  const handleAddToQuote = () => {
    if (!product || selectedIds.has(product._id)) return;

    const next = new Set(selectedIds).add(product._id);
    setSelectedIds(next);

    const stored = JSON.parse(localStorage.getItem("product_list") || "[]");
    stored.push({
      id: product._id,
      name: product.name,
      brand: product.brand,
      code: product.code,
      packingSizes: product.packingSizes || [],
    });
    localStorage.setItem("product_list", JSON.stringify(stored));
    navigate("/request-quote");
  };

  return (
    <div className="block md:hidden min-h-screen bg-gray-50 pt-20 px-4 pb-4">
      {/* Back button */}
      <nav className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 transition"
        >
          <FaChevronLeft size={20} className="mr-1" />
          Back to Products
        </button>
      </nav>

      {loading ? (
        <p className="text-center text-gray-600 mt-8">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-8">Error: {error}</p>
      ) : (
        product && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Image (downloadable + draggable) */}
            {product.imageUrl && (
              <a
                href={product.imageUrl}
                download
                className="block overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  draggable="true"
                  className="w-full object-contain max-h-48"
                />
              </a>
            )}

            <div className="p-4 space-y-3">
              <h1 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h1>

              <div className="text-gray-600 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Brand:</span> {product.brand}
                </p>
                <p>
                  <span className="font-medium">Code:</span> {product.code}
                </p>
                <p>
                  <span className="font-medium">Origin:</span>{" "}
                  {product.countryOfOrigin || "—"}
                </p>
                {product.packingSizes?.length > 0 && (
                  <p>
                    <span className="font-medium">Packing:</span>{" "}
                    {product.packingSizes.join(", ")}
                  </p>
                )}
              </div>

              <p className="text-gray-700 text-sm">
                {product.description || "No description available."}
              </p>

              {product.documentUrl && (
                <a
                  href={product.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <FaFilePdf />
                  <span>Download PDF</span>
                </a>
              )}

              <button
                onClick={handleAddToQuote}
                disabled={selectedIds.has(product._id)}
                className={`w-full py-2 rounded-lg text-white text-center transition ${
                  selectedIds.has(product._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {selectedIds.has(product._id)
                  ? "Added to Quote"
                  : "Add to Quote"}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
