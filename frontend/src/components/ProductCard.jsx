import React, { useState } from "react";
import { FaFilePdf, FaCheckCircle, FaImage } from "react-icons/fa";

export default function ProductCard({
  product,
  isSelected,
  onCardClick,
  onAddToQuote,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onCardClick}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer flex flex-col justify-between h-full"
    >
      {/* Product Image Container */}
      <div className="mb-4 h-40 w-full bg-white flex items-center justify-center overflow-hidden rounded-md relative">
        {/* spinner while loading */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-transparent rounded-full" />
          </div>
        )}

        {/* placeholder on error */}
        {imgError ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
            <FaImage className="text-4xl" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`max-h-full max-w-full object-contain transition-opacity duration-300 select-none ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {product.name}
        </h3>
        <p className="text-gray-600">Brand: {product.brand}</p>
        <p className="text-gray-600">Code: {product.code}</p>
        <p className="text-gray-600">Origin: {product.countryOfOrigin}</p>
        <p className="text-gray-600">
          Packing:{" "}
          {product.packingSizes?.length ? product.packingSizes.join(", ") : "—"}
        </p>
      </div>

      <div className="mt-4 flex items-center">
        {/* Only show PDF icon if there's a document */}
        {product.documentUrl && (
          <FaFilePdf
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.documentUrl, "_blank");
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          />
        )}
        <div className="ml-auto">
          {isSelected ? (
            <FaCheckCircle className="text-green-500 text-2xl" />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToQuote();
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              Add to Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
