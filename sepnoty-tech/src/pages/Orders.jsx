import React, { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/mine");
      if (data?.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setError("Invalid response from server");
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-indigo-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2 sm:mb-0">
            My Orders
          </h1>
          <p className="text-gray-500 text-sm">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              You haven’t placed any orders yet.
            </h2>
            <p className="text-sm text-gray-500">
              Browse our products and start shopping!
            </p>
            <a
              href="/"
              className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            {/* ============ DESKTOP TABLE ============ */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-indigo-100">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-indigo-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-indigo-50/40 transition-colors border-b border-gray-100"
                    >
                      <td className="px-6 py-4 text-indigo-700 font-medium">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.orderItems
                          .map((i) => `${i.name} ×${i.qty}`)
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ₹{order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-fit ${
                              order.isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.isPaid ? "Paid" : "Unpaid"}
                          </span>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-fit ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.status === "Processing"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                          {order.paymentMethod && (
                            <span className="text-xs text-gray-500 capitalize">
                              {order.paymentMethod}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ============ MOBILE CARDS ============ */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/90 backdrop-blur-md shadow-md border border-indigo-100 rounded-2xl p-4 transition hover:shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-700">
                        ₹{order.totalPrice.toLocaleString()}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1 justify-end">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-gray-700 mb-1">
                      Items
                    </p>
                    <ul className="space-y-1">
                      {order.orderItems.map((i, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 flex justify-between"
                        >
                          <span>
                            {i.name} × {i.qty}
                          </span>
                          <span className="text-gray-400">
                            ₹{i.price.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
