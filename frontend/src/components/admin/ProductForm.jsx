import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch";
import ProductForm from "../../components/admin/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch the list from the API
  const loadProducts = () => {
    authFetch("/api/admin/products")
      .then((data) => setProducts(data))
      .catch(console.error);
  };
  useEffect(loadProducts, []);

  // Open modal in “create” mode
  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Open modal in “edit” mode
  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await authFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadProducts();
          }}
        />
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {[
              "Name",
              "Code",
              "Brand",
              "Description",
              "Origin",
              "Image",
              "Document",
              "Packing Sizes",
              "Actions",
            ].map((h) => (
              <th key={h} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.code}</td>
              <td className="px-4 py-2">{p.brand}</td>
              <td className="px-4 py-2">{p.description}</td>
              <td className="px-4 py-2">{p.countryOfOrigin}</td>
              <td className="px-4 py-2">
                {p.imageUrl ? (
                  <a
                    href={p.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-2">
                {p.documentUrl ? (
                  <a
                    href={p.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-2">
                {p.packingSizes?.length ? p.packingSizes.join(", ") : "—"}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => openEditForm(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
