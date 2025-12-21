import React from "react";

export default function BrandFilterSidebar({
  brands,
  selectedBrand,
  onSelectBrand,
}) {
  return (
    <aside className="w-full lg:w-1/5 mb-6 lg:mb-0 lg:pr-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Filter by Brand
      </h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectBrand("")}
            className={`block w-full text-left px-3 py-2 rounded-lg ${
              !selectedBrand
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            } transition`}
          >
            All
          </button>
        </li>
        {brands.map((b) => (
          <li key={b}>
            <button
              onClick={() => onSelectBrand(b)}
              className={`block w-full text-left px-3 py-2 rounded-lg ${
                selectedBrand === b
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition`}
            >
              {b}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
