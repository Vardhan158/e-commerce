import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Trash2, RefreshCw } from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      const products = data?.products ?? data ?? [];
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-60 text-indigo-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
        Loading products...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            Product Management
          </h2>
          <button
            onClick={fetchProducts}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white/70 backdrop-blur-lg border border-indigo-100 rounded-xl shadow">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="group bg-white/70 backdrop-blur-lg border border-indigo-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={
                      p.thumbnail ||
                      p.image ||
                      (p.images && p.images[0]?.url) ||
                      "https://via.placeholder.com/300x200?text=Product+Image"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {p.name}
                    </h3>
                    <p className="text-indigo-600 font-medium mt-1">
                      ₹{p.offerPrice || p.price}
                      {p.offerPrice && p.offerPrice < p.price && (
                        <span className="text-gray-400 text-sm line-through ml-2">
                          ₹{p.price}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{p.category}</p>
                    <div className="flex items-center mt-2 gap-1">
                      {Array(5)
                        .fill("")
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                              i < (p.rating || 0)
                                ? "#6366f1"
                                : "rgba(99,102,241,0.3)"
                            }
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                          >
                            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.85 1.416 8.262L12 19.771l-7.416 4.089L6 15.598 0 9.748l8.332-1.73z" />
                          </svg>
                        ))}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
