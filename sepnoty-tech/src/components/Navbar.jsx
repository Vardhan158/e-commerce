import React, { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Navbar({ user }) {
  const [open, setOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const searchRef = React.useRef(null);
  const navigate = useNavigate();

  const [localUser, setLocalUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // 💡 Debounced search logic
  const handleSearchChange = useCallback(async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      setIsSearching(true);
      try {
        const { data } = await api.get("/products");
        const filteredProducts = data.products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredProducts);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleProductClick = (product) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    navigate(`/product/${product._id}`, {
      state: { product },
    });
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + item.qty, 0);
      setCartCount(count);
    };

    updateCartCount();

    const handleStorage = () => {
      updateCartCount();
      try {
        setLocalUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setLocalUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleStorage);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setCartCount(0);
    setLocalUser(null);
    navigate("/");
  };

  // 🔥 Navbar Component
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 transition-all">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="MyShop Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-sm"
          />
          <span className="text-2xl font-bold text-indigo-600 tracking-tight">
            MyShop
          </span>
        </Link>

        {/* 🔍 Search (Desktop Only) */}
        <div
          className="hidden lg:flex items-center relative w-1/3"
          ref={searchRef}
        >
          <div className="flex items-center bg-gray-50 border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400 rounded-full px-3 w-full shadow-sm transition-all">
            <input
              className="py-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
            />
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500"
              >
                <path
                  d="M12 12l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </div>

          {/* Dropdown Results */}
          {showDropdown && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-80 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-all border-b last:border-b-0"
                  >
                    <img
                      src={product.thumbnail || product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-indigo-600 font-semibold">
                        ₹{product.offerPrice || product.price}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🧭 Navigation Links */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-indigo-600 transition-colors">
            Shop
          </Link>
          <Link to="/about" className="hover:text-indigo-600 transition-colors">
            About
          </Link>
          {(user || localUser) && (
            <Link to="/orders" className="hover:text-indigo-600 transition-colors">
              Orders
            </Link>
          )}

          {/* 🛒 Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer hover:scale-105 transition-transform"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-indigo-600 text-white w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </div>

          {/* 👤 Auth Buttons */}
          {user || localUser ? (
            <button
              onClick={logout}
              className="ml-4 px-5 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow-md transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ml-4 px-5 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow-md transition-all"
            >
              Login
            </button>
          )}
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 📱 Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-6 py-4 space-y-3 animate-slideDown">
          <Link to="/" onClick={() => setOpen(false)} className="block hover:text-indigo-600">
            Home
          </Link>
          <Link to="/products" onClick={() => setOpen(false)} className="block hover:text-indigo-600">
            Shop
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className="block hover:text-indigo-600">
            About
          </Link>
          {(user || localUser) && (
            <Link to="/orders" onClick={() => setOpen(false)} className="block hover:text-indigo-600">
              My Orders
            </Link>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-indigo-600 font-medium"
            >
              🛒 Cart ({cartCount})
            </button>
            {user || localUser ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
