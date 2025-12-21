// src/pages/ServicesPageMobile.jsx
import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ServicesPageMobile({ apiBase }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalService, setModalService] = useState(null);

  // track which services have been added (by id)
  const [selectedIds, setSelectedIds] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("service_list") || "[]");
    return new Set(stored.map((item) => item.id));
  });

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Fetch services
  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/api/services`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase]);

  // Filter by search term
  const filtered = services.filter((svc) => {
    const q = searchTerm.toLowerCase();
    return (
      svc.name.toLowerCase().includes(q) ||
      svc.description.toLowerCase().includes(q)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentServices = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Add service to quote
  const addToQuote = (service) => {
    if (selectedIds.has(service._id)) return;

    // update selected IDs
    const nextIds = new Set(selectedIds).add(service._id);
    setSelectedIds(nextIds);

    // update localStorage array of { id, name }
    const stored = JSON.parse(localStorage.getItem("service_list") || "[]");
    stored.push({ id: service._id, name: service.name });
    localStorage.setItem("service_list", JSON.stringify(stored));

    // go to quote page
    navigate("/request-quote");
  };

  return (
    <div className="md:hidden min-h-screen bg-gray-100 p-4 pt-6">
      {/* Static intro */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h1>
        <p className="text-base text-gray-700">
          At Damodor, we offer a full suite of expertise—from consulting and
          implementation to ongoing support and optimization. Explore below to
          see how we can help you succeed.
        </p>
      </div>

      {/* Search + items-per-page */}
      <div className="mb-6 flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex items-center justify-end space-x-2">
          <label htmlFor="perPage" className="text-gray-700">
            Show:
          </label>
          <select
            id="perPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded p-2"
          >
            <option value={20}>20 / page</option>
            <option value={30}>30 / page</option>
          </select>
        </div>
      </div>

      {/* List or message */}
      {loading ? (
        <p className="text-gray-600">Loading services…</p>
      ) : error ? (
        <p className="text-red-500 mb-4">Error: {error}</p>
      ) : currentServices.length === 0 ? (
        <p className="italic text-gray-600">No services match your criteria.</p>
      ) : (
        <ul className="space-y-4">
          {currentServices.map((svc, idx) => (
            <li
              key={svc._id}
              onClick={() => setModalService(svc)}
              className={`flex items-center justify-between border rounded-lg shadow-sm p-4 cursor-pointer transition ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:shadow-md`}
            >
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {svc.name}
                </h2>
                <p className="text-gray-600 line-clamp-2">{svc.description}</p>
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-32 flex-shrink-0 flex justify-end"
              >
                {selectedIds.has(svc._id) ? (
                  <FaCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <button
                    onClick={() => addToQuote(svc)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
                  >
                    Add to Quote
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal for details */}
      {modalService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-semibold text-gray-800">
                {modalService.name}
              </h2>
              <FaTimes
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => setModalService(null)}
              />
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">{modalService.description}</p>
            </div>
            <div className="flex justify-between p-4 border-t">
              <button
                onClick={() => setModalService(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
              {selectedIds.has(modalService._id) ? (
                <FaCheckCircle className="text-green-500 text-2xl self-center" />
              ) : (
                <button
                  onClick={() => {
                    addToQuote(modalService);
                    setModalService(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Add to Quote
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
