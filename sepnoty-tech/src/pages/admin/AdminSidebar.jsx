import React, { useState } from "react";
import {
  Package,
  Users,
  ShoppingBag,
  PlusSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

export default function AdminSidebar({ activeView, setActiveView }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { id: "products", icon: Package, label: "Products" },
    { id: "addProduct", icon: PlusSquare, label: "Add Product" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "users", icon: Users, label: "Users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* ======= Mobile Menu Toggle Button ======= */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 p-2 bg-indigo-600 text-white rounded-md shadow-md md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* ======= Sidebar ======= */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen md:h-auto bg-white/80 backdrop-blur-lg border-r border-indigo-100 shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-between 
          ${collapsed ? "w-20" : "w-64"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* ======= Top Section ======= */}
        <div>
          {/* Brand / Collapse Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h1
              className={`font-extrabold text-indigo-600 text-xl transition-all ${
                collapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Admin
            </h1>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center p-1 text-gray-500 hover:text-indigo-600 transition"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1 overflow-y-auto scrollbar-hide">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center w-full p-2 rounded-lg text-left transition-all group ${
                  activeView === item.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-100"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    activeView === item.id ? "text-white" : "text-indigo-500"
                  }`}
                />
                {!collapsed && (
                  <span className="ml-3 font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* ======= Bottom Logout ======= */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center w-full py-2 rounded-md transition-all ${
              collapsed
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white font-medium gap-2"
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ======= Mobile Backdrop ======= */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-30"
        />
      )}
    </>
  );
}
