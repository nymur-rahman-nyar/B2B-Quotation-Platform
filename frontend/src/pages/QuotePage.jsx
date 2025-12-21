// src/pages/QuotePage.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function QuotePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  // ─── LOAD FROM localStorage ────────────────────────────────────────────────
  useEffect(() => {
    // Services
    const svcList = JSON.parse(localStorage.getItem("service_list") || "[]");
    setServices(
      svcList.map((s) => ({
        ...s,
        requirement: s.additional_info || "",
        showReq: Boolean(s.additional_info),
      }))
    );

    // Products
    const prodList = JSON.parse(localStorage.getItem("product_list") || "[]");
    setProducts(
      prodList.map((p) => {
        const savedItems = Array.isArray(p.quantity) ? p.quantity : [];
        const items =
          savedItems.length > 0
            ? savedItems
            : p.packingSizes?.length === 1
            ? [{ size: p.packingSizes[0], qty: "" }]
            : [];
        return {
          ...p,
          items,
          requirement: p.additional_info || "",
          showReq: Boolean(p.additional_info),
        };
      })
    );
  }, []);

  // ─── PERSIST SERVICES ─────────────────────────────────────────────────────
  useEffect(() => {
    const toStore = services.map(({ id, name, requirement }) => ({
      id,
      name,
      additional_info: requirement,
    }));
    localStorage.setItem("service_list", JSON.stringify(toStore));
  }, [services]);

  // ─── PERSIST PRODUCTS ─────────────────────────────────────────────────────
  useEffect(() => {
    const toStore = products.map(
      ({ id, name, brand, code, packingSizes, items, requirement }) => ({
        id,
        name,
        brand,
        code,
        packingSizes,
        quantity: items,
        additional_info: requirement,
      })
    );
    localStorage.setItem("product_list", JSON.stringify(toStore));
  }, [products]);

  // ─── STATE UPDATERS ────────────────────────────────────────────────────────
  const removeService = (id) =>
    setServices((prev) => prev.filter((s) => s.id !== id));
  const removeProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const toggleServiceReq = (id) =>
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, showReq: !s.showReq } : s))
    );
  const handleServiceReqChange = (id, e) =>
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, requirement: e.target.value } : s))
    );

  const toggleProductReq = (id) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, showReq: !p.showReq } : p))
    );
  const handleProductReqChange = (id, e) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, requirement: e.target.value } : p))
    );

  const addProductItem = (id) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, items: [...p.items, { size: "", qty: "" }] } : p
      )
    );
  const removeProductItem = (id, idx) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              items: p.items.filter((_, i) => i !== idx),
            }
          : p
      )
    );
  const handleProductItemChange = (id, idx, field, value) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              items: p.items.map((it, i) =>
                i === idx ? { ...it, [field]: value } : it
              ),
            }
          : p
      )
    );

  const handleSubmit = () => {
    navigate("/quote-info", { state: { services, products } });
  };

  const hasItems = services.length + products.length > 0;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold">Quote Request</h1>

        {!hasItems ? (
          <div className="text-center py-20 text-gray-500 space-y-4">
            <p>Your quote list is empty.</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/services")}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                Browse Services
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Services */}
            {services.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Services</h2>
                <ul className="space-y-4">
                  {services.map((s) => (
                    <li
                      key={s.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{s.name}</span>
                        <button
                          onClick={() => removeService(s.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <button
                        onClick={() => toggleServiceReq(s.id)}
                        className="text-indigo-600 text-sm underline"
                      >
                        {s.showReq
                          ? "Hide additional requirements"
                          : "Add additional requirements"}
                      </button>
                      {s.showReq && (
                        <textarea
                          value={s.requirement}
                          onChange={(e) => handleServiceReqChange(s.id, e)}
                          className="w-full border border-gray-300 rounded p-2"
                          placeholder="Any extra details..."
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Products */}
            {products.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Products</h2>
                <ul className="space-y-4">
                  {products.map((p) => (
                    <li
                      key={p.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 hover:shadow-lg transition-shadow"
                    >
                      {/* header */}
                      <div className="flex justify-between items-center space-x-4">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-gray-600">
                            Brand: {p.brand}
                          </p>
                          <p className="text-sm text-gray-600">
                            Code: {p.code}
                          </p>
                        </div>
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      {/* size + quantity */}
                      {p.packingSizes?.length > 0 && (
                        <div className="space-y-2">
                          <label className="font-medium">
                            {p.packingSizes.length > 1
                              ? "Select packing size and quantity:"
                              : `Enter quantity for ${p.packingSizes[0]}:`}
                          </label>

                          <ul className="space-y-2">
                            {p.items.map((it, idx) => {
                              const chosen = p.items
                                .map((x) => x.size)
                                .filter(Boolean);
                              return (
                                <li
                                  key={idx}
                                  className="flex items-center space-x-2"
                                >
                                  {p.packingSizes.length > 1 ? (
                                    <select
                                      value={it.size}
                                      onChange={(e) =>
                                        handleProductItemChange(
                                          p.id,
                                          idx,
                                          "size",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded p-1 flex-1"
                                    >
                                      <option value="">Select size…</option>
                                      {p.packingSizes.map((sz) => (
                                        <option
                                          key={sz}
                                          value={sz}
                                          disabled={
                                            chosen.includes(sz) &&
                                            sz !== it.size
                                          }
                                        >
                                          {sz}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="flex-1 text-gray-700">
                                      {p.packingSizes[0]}
                                    </span>
                                  )}

                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Qty"
                                    value={it.qty}
                                    onChange={(e) =>
                                      handleProductItemChange(
                                        p.id,
                                        idx,
                                        "qty",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 rounded p-1 w-20"
                                  />

                                  <button
                                    onClick={() => removeProductItem(p.id, idx)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <FaTimes />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>

                          {p.packingSizes.length > 1 &&
                            p.items.length < p.packingSizes.length && (
                              <button
                                onClick={() => addProductItem(p.id)}
                                className="flex items-center text-indigo-600 text-sm"
                              >
                                <FaPlus className="mr-1" /> Add another
                              </button>
                            )}
                        </div>
                      )}

                      {/* requirements toggle */}
                      <button
                        onClick={() => toggleProductReq(p.id)}
                        className="text-indigo-600 text-sm underline"
                      >
                        {p.showReq
                          ? "Hide additional requirements"
                          : "Add additional requirements"}
                      </button>
                      {p.showReq && (
                        <textarea
                          value={p.requirement}
                          onChange={(e) => handleProductReqChange(p.id, e)}
                          className="w-full border border-gray-300 rounded p-2"
                          placeholder="Any extra details..."
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/services")}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                Add Services
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Add Products
              </button>
              <button
                onClick={handleSubmit}
                disabled={!hasItems}
                className={`py-2 px-6 rounded font-semibold transition ${
                  hasItems
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Quote Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
