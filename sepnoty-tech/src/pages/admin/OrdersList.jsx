import React, { useEffect, useState } from "react";
import api from "../../api";
import { RefreshCw } from "lucide-react";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.orders || [];
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    const previousOrder = orders.find((o) => o._id === orderId);
    const previousStatus = previousOrder?.status;
    try {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );

      const response = await api.put(`/admin/orders/${orderId}`, {
        status,
        orderId,
      });

      if (!response.data?.success)
        throw new Error(response.data.message || "Update failed");

      alert(`✅ Order #${orderId.slice(-6)} updated to ${status}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(`❌ Failed to update: ${err.message}`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: previousStatus } : o
        )
      );
    } finally {
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center p-8 text-gray-700">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto text-center">
        <strong>Error: </strong>
        {error}
        <button
          onClick={fetchOrders}
          className="mt-3 bg-red-100 hover:bg-red-200 px-4 py-1 rounded text-sm text-red-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="bg-white/70 backdrop-blur-lg border border-indigo-100 shadow-lg rounded-xl p-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
          Orders Management
        </h2>
        <button
          onClick={fetchOrders}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
        >
          <RefreshCw size={18} className="animate-spin-slow" />
          Refresh
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Total Orders: {orders.length}
      </p>

      {/* ======= Desktop Table View ======= */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-indigo-50 text-indigo-700 text-xs uppercase font-semibold">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Items",
                "Total",
                "Payment",
                "Status",
                "Actions",
              ].map((head) => (
                <th key={head} className="px-4 py-3 text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-indigo-50/40 transition">
                <td className="px-4 py-2 font-semibold text-indigo-600">
                  #{order._id.slice(-6)}
                </td>
                <td className="px-4 py-2">
                  <div>
                    <p className="font-medium">
                      {order.shippingAddress?.fullName || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.shippingAddress?.phone || "—"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <p className="truncate max-w-xs">
                    {order.orderItems.map((i) => `${i.name} (${i.qty})`).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.orderItems.reduce((s, i) => s + i.qty, 0)} items
                  </p>
                </td>
                <td className="px-4 py-2 font-semibold">
                  ${order.totalPrice?.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {order.paymentMethod || "N/A"}
                  </p>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`px-2 py-1 rounded-md border text-xs cursor-pointer transition focus:ring-2 focus:ring-indigo-400
                      ${
                        order.status === "Delivered"
                          ? "bg-green-50 border-green-200"
                          : order.status === "Shipped"
                          ? "bg-blue-50 border-blue-200"
                          : order.status === "Processing"
                          ? "bg-purple-50 border-purple-200"
                          : order.status === "Cancelled"
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <option value="Pending">🕒 Pending</option>
                    <option value="Processing">⚙️ Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                    <option value="Refunded">↩️ Refunded</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={fetchOrders}
                    title="Refresh"
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <RefreshCw size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======= Mobile Card View ======= */}
      <div className="space-y-4 lg:hidden">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-indigo-600">
                #{order._id.slice(-6)}
              </h3>
              <select
                value={order.status || "Pending"}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="text-xs border rounded-md px-2 py-1 focus:ring-indigo-400"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <p className="text-sm font-medium text-gray-800">
              {order.shippingAddress?.fullName || "Guest"}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              {order.shippingAddress?.phone || "—"}
            </p>

            <p className="text-sm text-gray-700 mb-1">
              Total:{" "}
              <span className="font-semibold text-indigo-600">
                ${order.totalPrice?.toFixed(2)}
              </span>
            </p>

            <p className="text-xs text-gray-500">
              {order.orderItems.reduce((s, i) => s + i.qty, 0)} items
            </p>

            <div className="flex items-center justify-between mt-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.isPaid ? "Paid" : "Pending"}
              </span>
              <button
                onClick={fetchOrders}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
