// src/pages/ProductsPageMobile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import ProductCardMobile from "../components/ProductCardMobile";

export default function ProductsPageMobile({ apiBase }) {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [selectedIds, setSelectedIds] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("product_list") || "[]");
    return new Set(stored.map((item) => item.id));
  });

  const navigate = useNavigate();

  // pagination & limit
  const [page, setPage] = useState(() => {
    const stored = localStorage.getItem("productsPage");
    return stored ? parseInt(stored, 10) : 1;
  });
  const [limit, setLimit] = useState(12);

  // persist page
  useEffect(() => {
    localStorage.setItem("productsPage", page);
  }, [page]);

  // restore scroll on mount
  useEffect(() => {
    if (!loading) {
      const saved = parseInt(localStorage.getItem("productsScroll") || "0", 10);
      window.scrollTo(0, saved);
    }
  }, [loading]);

  // persist scroll on scroll
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("productsScroll", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
  const isMounted = useRef(true);
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

  // handle detail navigation
  const handleDetailClick = (id, slug) => {
    localStorage.setItem("lastClickedProduct", id);
    navigate(`/products/${slug}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="block md:hidden min-h-screen bg-gray-50 pt-16 px-4 pb-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Our Products</h1>

      {/* Search */}
      <div className="relative mb-6 mt-2">
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

      {/* Filters & Limit */}
      <div className="flex space-x-2 mb-4">
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setPage(1);
            window.scrollTo(0, 0);
          }}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
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

      {/* Product List */}
      {loading ? (
        <p className="text-gray-600">
          Connecting... please wait{retrying ? " Retrying..." : ""}
        </p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products match.</p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p._id}>
              <ProductCardMobile
                product={p}
                isSelected={selectedIds.has(p._id)}
                onCardClick={() => handleDetailClick(p._id, p.slug)}
                onAddToQuote={() => handleQuoteClick(p._id)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
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
      )}
    </div>
  );
}
