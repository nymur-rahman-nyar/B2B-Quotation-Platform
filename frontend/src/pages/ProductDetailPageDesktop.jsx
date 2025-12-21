// src/pages/ProductDetailPageDesktop.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { FaFilePdf, FaFileSignature } from "react-icons/fa";

export default function ProductDetailPageDesktop({ apiBase }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inQuote, setInQuote] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        // FETCH BY PARAM (ID or SLUG)
        const res = await fetch(`${apiBase}/api/products/${slug}`);
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load product");
        }
        const { product } = await res.json();
        setProduct(product);

        // check if already in the quote list
        const stored = JSON.parse(localStorage.getItem("product_list") || "[]");
        setInQuote(stored.some((item) => item.id === product._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase, slug]);

  const handleAddToQuote = () => {
    const stored = JSON.parse(localStorage.getItem("product_list") || "[]");
    if (!stored.some((item) => item.id === product._id)) {
      stored.push({
        id: product._id,
        name: product.name,
        brand: product.brand,
        code: product.code,
        packingSizes: product.packingSizes || [],
        quantity: [], // filled later on quote page
      });
      localStorage.setItem("product_list", JSON.stringify(stored));
      setInQuote(true);
    }
    navigate("/request-quote");
  };

  if (loading) {
    return (
      <div className="hidden md:block flex items-center justify-center h-screen bg-gradient-to-r from-[#08102e] to-[#505374]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hidden md:block flex items-center justify-center h-screen bg-gradient-to-r from-[#08102e] to-[#505374]">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="hidden md:block">
      <section className="bg-gradient-to-r from-[#08102e] to-[#505374] min-h-screen py-16">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Back button */}
          <nav className="flex items-center text-sm text-gray-300 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center hover:text-white transition"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Back to Products
            </button>
          </nav>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              {product.imageUrl && (
                <div className="w-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className="w-full h-auto object-contain max-h-[80vh] transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              {/* Info */}
              <div className="p-8 flex flex-col">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {product.name}
                </h1>
                <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <span className="font-semibold">Brand:</span>{" "}
                    {product.brand}
                  </p>
                  <p>
                    <span className="font-semibold">Code:</span> {product.code}
                  </p>
                  <p>
                    <span className="font-semibold">Origin:</span>{" "}
                    {product.countryOfOrigin || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Packing:</span>{" "}
                    {product.packingSizes?.join(", ") || "—"}
                  </p>
                </div>

                {/* Description */}
                <div className="mt-8 text-gray-800 leading-relaxed flex-grow">
                  <p>{product.description || "No description available."}</p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center space-x-4">
                  {product.documentUrl && (
                    <a
                      href={product.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
                    >
                      <FaFilePdf className="mr-2" />
                      Specs
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQuote();
                    }}
                    disabled={inQuote}
                    className={`inline-flex items-center px-6 py-3 ${
                      inQuote
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } font-medium rounded-lg shadow transition`}
                  >
                    <FaFileSignature className="mr-2" />
                    {inQuote ? "Already in Quote" : "Add to Quote"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
