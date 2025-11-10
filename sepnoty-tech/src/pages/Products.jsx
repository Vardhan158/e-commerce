import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

const Products = () => {
  const [products, setProducts] = useState(() => {
    const cached = localStorage.getItem("cachedProducts");
    return cached ? JSON.parse(cached) : [];
  });
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(products.length === 0);
  const [error, setError] = useState(null);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => {
    const cachedTime = localStorage.getItem("lastUpdated");
    return cachedTime ? new Date(cachedTime) : null;
  });

  const navigate = useNavigate();
  const hasFetched = useRef(false);

  // 💰 Currency format: INR
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  // 🔄 Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        if (!data.success || !Array.isArray(data.products)) {
          throw new Error("Invalid data");
        }

        const productList = data.products.map((p) => ({
          id: p._id,
          name: p.name,
          price: Number(p.price || 0),
          offerPrice: Number(p.offerPrice || p.price || 0),
          category: p.category || "General",
          brand: p.brand || "No Brand",
          countInStock: Number(p.countInStock || 0),
          rating: Number(p.rating || 0),
          thumbnail:
            p.thumbnail ||
            p.images?.[0]?.url ||
            "https://via.placeholder.com/300x200?text=Product+Image",
        }));

        setProducts(productList);
        setFiltered(productList);
        setCategories([...new Set(productList.map((p) => p.category))]);
        localStorage.setItem("cachedProducts", JSON.stringify(productList));
        localStorage.setItem("lastUpdated", new Date().toISOString());
        setLastUpdated(new Date());
      } catch (err) {
        setError("Failed to load products. Please try again later.",err);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }
  }, []);

  // 🧠 Apply filters (price & category)
  useEffect(() => {
    let updated = [...products];
    updated = updated.filter((p) => Math.min(p.price, p.offerPrice) <= maxPrice);
    if (selectedCategories.length)
      updated = updated.filter((p) => selectedCategories.includes(p.category));
    setFiltered(updated);
  }, [maxPrice, selectedCategories, products]);

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const getLastUpdatedText = () =>
    lastUpdated ? lastUpdated.toLocaleString() : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-indigo-100 py-10 px-4 sm:px-8 flex flex-col md:flex-row gap-8 relative">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="md:hidden mb-4 flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 4h18M6 12h12M10 20h4" />
          </svg>
          Filters
        </button>

        {/* Sidebar Filters */}
        <aside
          className={`md:w-1/4 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200 p-6 transition-all duration-500 ${
            filterOpen ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-lg font-semibold text-indigo-600 mb-4 flex justify-between">
            Filters
            <button
              onClick={() => setFilterOpen(false)}
              className="text-gray-400 text-sm md:hidden"
            >
              ✕
            </button>
          </h2>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">
              Max Price:{" "}
              <span className="font-semibold text-indigo-600">
                {formatCurrency(maxPrice)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹1L+</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Categories
            </h3>
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 mb-2 cursor-pointer text-gray-700 hover:text-indigo-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-indigo-500"
                  />
                  {cat}
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No categories found</p>
            )}
          </div>
        </aside>

        {/* Products Section */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">
            All Products
          </h1>
          {getLastUpdatedText() && (
            <p className="text-sm text-center text-gray-500 mb-6">
              Last updated: {getLastUpdatedText()}
            </p>
          )}

          {/* States */}
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin mx-auto h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
              <p className="text-gray-500 mt-3">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map((product, i) => (
                <div
                  key={i}
                  onClick={() =>
                    navigate(`/product/${product.id}`, { state: { product } })
                  }
                  className="cursor-pointer bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all"
                >
                  <div className="relative w-full h-44 bg-gray-50 flex items-center justify-center rounded-xl overflow-hidden">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="object-contain w-full h-full hover:scale-105 transition-transform"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image")
                      }
                    />
                  </div>

                  <div className="mt-3 space-y-1 text-sm">
                    <p className="uppercase text-gray-400 text-xs tracking-wide">
                      {product.category}
                    </p>
                    <p className="font-semibold text-gray-800 truncate">
                      {product.name}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <svg
                            key={j}
                            width="14"
                            height="13"
                            viewBox="0 0 18 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                              fill={
                                product.rating > j
                                  ? "#615fff"
                                  : "rgba(97,95,255,0.3)"
                              }
                            />
                          </svg>
                        ))}
                      <p className="text-xs text-gray-500 ml-1">
                        ({product.rating})
                      </p>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <p className="text-indigo-600 font-semibold text-base">
                          {formatCurrency(product.offerPrice)}
                          {product.price > product.offerPrice && (
                            <span className="text-gray-400 text-xs line-through ml-2">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </p>
                        {product.price > product.offerPrice && (
                          <p className="text-xs text-green-600">
                            {Math.round(
                              ((product.price - product.offerPrice) /
                                product.price) *
                                100
                            )}
                            % OFF
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.countInStock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.countInStock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg py-8">
              No products match your filters.
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default Products;
