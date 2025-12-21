// src/pages/ProductsPageDesktop.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaFilePdf, FaTimes, FaSearch } from "react-icons/fa";
import BrandFilterSidebar from "../components/BrandFilterSidebar";
import ProductCard from "../components/ProductCard";

export default function ProductsPageDesktop({ apiBase }) {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState(null);
  const [justArrived, setJustArrived] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("product_list") || "[]");
    return new Set(stored.map((item) => item.id));
  });
  const [modalProduct, setModalProduct] = useState(null);

  const navigate = useNavigate();

  // pagination
  const [page, setPage] = useState(() => {
    const stored = localStorage.getItem("productsPage");
    return stored ? parseInt(stored, 10) : 1;
  });
  useEffect(() => {
    localStorage.setItem("productsPage", page);
  }, [page]);

  // restore scroll on mount (after products load)
  useEffect(() => {
    if (!loading) {
      const saved = parseInt(localStorage.getItem("productsScroll") || "0", 10);
      window.scrollTo(0, saved);
    }
  }, [loading]);

  // persist scroll on every scroll
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("productsScroll", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [limit, setLimit] = useState(12);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // fetch brands
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/brands`);
        if (!res.ok) throw new Error("Failed to load brands");
        const data = await res.json();
        setBrands(data.map((b) => b.name));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [apiBase]);

  // fetch products with retry
  useEffect(() => {
    isMounted.current = true;

    const makeParams = () => {
      const qp = new URLSearchParams();
      qp.set("page", page);
      qp.set("limit", limit);
      if (searchTerm.trim()) qp.set("search", searchTerm.trim());
      if (selectedBrand) qp.set("brand", selectedBrand);
      return qp;
    };

    const fetchWithRetry = async () => {
      if (!isMounted.current) return;
      setLoading(true);
      setRetrying(false);
      setError(null);

      try {
        const res = await fetch(`${apiBase}/api/products?${makeParams()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { products: data, total: ttl } = await res.json();
        if (!isMounted.current) return;
        setProducts(Array.isArray(data) ? data : []);
        setTotal(ttl);
        setLoading(false);
      } catch (err) {
        if (!isMounted.current) return;
        console.error("Fetch failed, retrying...", err);
        setRetrying(true);
        setTimeout(fetchWithRetry, 3000);
      }
    };

    fetchWithRetry();
    return () => {
      isMounted.current = false;
    };
  }, [apiBase, page, limit, searchTerm, selectedBrand]);

  // after products load, scroll the last-clicked card into view
  useEffect(() => {
    if (!loading && products.length && justArrived) {
      const lastClicked = localStorage.getItem("lastClickedProduct");
      if (lastClicked) {
        const el = document.getElementById(`product-${lastClicked}`);
        if (el) el.scrollIntoView({ block: "center" });
        localStorage.removeItem("lastClickedProduct");
      }
      setJustArrived(false);
    }
  }, [loading, products, justArrived]);

  const totalPages = Math.ceil(total / limit);

  // handle adding to quote
  const handleQuoteClick = (id) => {
    localStorage.setItem("lastClickedProduct", id);

    if (selectedIds.has(id)) return;

    const nextIds = new Set(selectedIds).add(id);
    setSelectedIds(nextIds);

    const storedList = JSON.parse(localStorage.getItem("product_list") || "[]");
    const prod = products.find((p) => p._id === id);
    if (prod) {
      storedList.push({
        id: prod._id,
        name: prod.name,
        brand: prod.brand,
        code: prod.code,
        packingSizes: prod.packingSizes || [],
      });
      localStorage.setItem("product_list", JSON.stringify(storedList));
    }

    navigate("/request-quote");
  };

  // handle viewing product detail: save the id for quote/scroll, but navigate by slug
  const handleDetailClick = (id, slug) => {
    localStorage.setItem("lastClickedProduct", id);
    navigate(`/products/${slug}`);
  };

  return (
    <div className="hidden md:block min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
          Our Products
        </h1>

        {/* Search & Limit */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="relative w-full lg:w-1/2">
            <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
                window.scrollTo(0, 0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="limit" className="text-gray-600">
              Show:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
                window.scrollTo(0, 0);
              }}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={12}>12 / page</option>
              <option value={21}>21 / page</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <BrandFilterSidebar
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={(b) => {
              setSelectedBrand(b);
              setPage(1);
              window.scrollTo(0, 0);
            }}
          />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-600">
                Connecting... please wait{retrying ? " Retrying..." : ""}
              </p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products match.</p>
            ) : (
              products.map((p) => (
                <div key={p._id} id={`product-${p._id}`}>
                  <ProductCard
                    product={p}
                    isSelected={selectedIds.has(p._id)}
                    // now passes both id & slug
                    onCardClick={() => handleDetailClick(p._id, p.slug)}
                    onAddToQuote={() => handleQuoteClick(p._id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center space-x-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setPage(i + 1);
                window.scrollTo(0, 0);
              }}
              className={`px-3 py-1 rounded-lg ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-gray-300 transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {modalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full relative overflow-auto max-h-full p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setModalProduct(null)}
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-semibold mb-4">
                {modalProduct.name}
              </h2>
              <p>
                <strong>Brand:</strong> {modalProduct.brand}
              </p>
              <p>
                <strong>Code:</strong> {modalProduct.code}
              </p>
              <p>
                <strong>Origin:</strong> {modalProduct.countryOfOrigin}
              </p>
              <p>
                <strong>Packing:</strong>{" "}
                {modalProduct.packingSizes?.length
                  ? modalProduct.packingSizes.join(", ")
                  : "—"}
              </p>
              {modalProduct.description && (
                <p className="mt-4 text-gray-700">{modalProduct.description}</p>
              )}
              {modalProduct.documentUrl && (
                <a
                  href={modalProduct.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <FaFilePdf className="inline mr-2" /> Download PDF
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
