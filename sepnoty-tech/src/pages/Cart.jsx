import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(localCart);

      if (localStorage.getItem("token")) {
        try {
          const { data } = await api.get("/auth/cart");
          if (data.success && Array.isArray(data.cart)) {
            const merged = mergeServerAndLocalCart(data.cart, localCart);
            setCart(merged);
            localStorage.setItem("cart", JSON.stringify(merged));
            await api.post("/auth/cart", { cart: merged });
          }
        } catch (error) {
          console.error("Cart sync error:", error);
        }
      }
    };

    const mergeServerAndLocalCart = (serverCart, localCart) => {
      const merged = [...serverCart];
      localCart.forEach((localItem) => {
        const match = merged.find((item) => item.product === localItem.product);
        if (match) match.qty = Math.max(match.qty, localItem.qty);
        else merged.push(localItem);
      });
      return merged;
    };

    loadCart();
  }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    const next = cart.map((i) => (i.product === id ? { ...i, qty } : i));
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    if (localStorage.getItem("token")) {
      try {
        await api.post("/auth/cart", { cart: next });
      } catch (e) {
        console.error("Update failed:", e);
      }
    }
  };

  const removeItem = async (id) => {
    const next = cart.filter((i) => i.product !== id);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    if (localStorage.getItem("token")) {
      try {
        await api.post("/auth/cart", { cart: next });
      } catch (e) {
        console.error("Remove failed:", e);
      }
    }
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = cart.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gradient-to-b from-white via-indigo-50 to-indigo-100 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-10 text-center md:text-left">
          🛒 Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Your cart is empty 😕
            </h2>
            <p className="text-gray-500 mb-6">
              Add some amazing products to get started!
            </p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.product}
                  className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-100 last:border-none hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">SKU: {item.product}</p>
                    </div>
                  </div>

                  {/* Qty & Price */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center border rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQty(item.product, item.qty - 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-gray-700 font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.product, item.qty + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-600">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.product)}
                      className="text-red-500 hover:text-red-600 transition p-1"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-4 border border-indigo-100">
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <hr className="my-3 border-gray-200" />
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                  Proceed to Checkout →
                </button>
                <Link
                  to="/"
                  className="block text-center mt-3 text-sm text-indigo-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-between items-center sm:hidden shadow-lg">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold text-indigo-700">
              ₹{total.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
