import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import ProductList from "../components/admin/ProductList";
import OrdersList from "../components/admin/OrdersList";
import UsersList from "../components/admin/UsersList";
import ProductForm from "../components/admin/ProductForm";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("products");

  const renderView = () => {
    switch (activeView) {
      case "products":
        return <ProductList />;
      case "addProduct":
        return <ProductForm />;
      case "orders":
        return <OrdersList />;
      case "users":
        return <UsersList />;
      default:
        return <ProductList />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
