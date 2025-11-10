import React, { useState, useEffect, useRef } from "react";
import { Menu, LogOut, X, LayoutDashboard, ShoppingBag, Package, Users } from "lucide-react";

export default function AdminNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  // === Close dropdown when clicking outside ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-indigo-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* ===== Left Section ===== */}
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Brand */}
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        {/* ===== Right Section: User Avatar ===== */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <img
              src={
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border border-indigo-100 shadow-sm hover:scale-105 transition-transform"
            />
            <span className="hidden sm:inline text-gray-800 font-medium">
              {user?.name || "Admin"}
            </span>
          </button>

          {/* === Dropdown Menu === */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg border border-indigo-100 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition"
              >
                <LogOut size={16} className="text-indigo-600" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== Mobile Menu ===== */}
      <div
        className={`lg:hidden fixed top-[60px] left-0 w-full bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-5 opacity-0 invisible"
        }`}
      >
        <nav className="px-5 py-4 space-y-2 text-gray-700 text-sm font-medium">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-indigo-50 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={16} className="text-indigo-600" /> Dashboard
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-indigo-50 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag size={16} className="text-indigo-600" /> Orders
          </a>
          <a
            href="/admin/products"
            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-indigo-50 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Package size={16} className="text-indigo-600" /> Products
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-indigo-50 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users size={16} className="text-indigo-600" /> Users
          </a>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
