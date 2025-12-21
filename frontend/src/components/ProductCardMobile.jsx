// src/components/ProductCardMobile.jsx
import React from "react";
import { FaPlus, FaCheckCircle } from "react-icons/fa";

export default function ProductCardMobile({
  product,
  isSelected,
  onCardClick,
  onAddToQuote,
}) {
  return (
    <div
      role="button"
      onClick={onCardClick}
      className={`
        flex items-center bg-white border border-gray-200 rounded-lg shadow-sm
        hover:shadow-md active:scale-[0.98] transition-all duration-150
        p-3 mb-3 cursor-pointer
      `}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 p-1 bg-gray-50 rounded-md">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-14 h-14 object-contain rounded"
        />
      </div>

      {/* Info */}
      <div className="flex-1 mx-3">
        <h2 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h2>
        <p className="mt-1 text-xs uppercase text-gray-500">
          {product.brand} · {product.code}
        </p>
      </div>

      {/* Add-to-Quote Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddToQuote();
        }}
        aria-label={isSelected ? "Remove from quote" : "Add to quote"}
        className={`
          flex items-center justify-center w-9 h-9 rounded-full
          transition-colors duration-150
          ${
            isSelected
              ? "bg-indigo-50 hover:bg-indigo-100"
              : "bg-gray-100 hover:bg-gray-200"
          }
        `}
      >
        {isSelected ? (
          <FaCheckCircle className="w-4 h-4 text-indigo-600" />
        ) : (
          <FaPlus className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}
