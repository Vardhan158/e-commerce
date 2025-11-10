import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Checkout() {
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartItems.length === 0) navigate("/cart");
    setCart(cartItems);
  }, [navigate]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping_fee = 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping_fee + tax;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    for (let key in shipping) if (!shipping[key]) return false;
    return true;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        const { data } = await api.post("/orders", {
          orderItems: cart,
          shippingAddress: shipping,
          totalAmount: total,
        });
        localStorage.removeItem("cart");
        navigate("/orders", { state: { orderId: data._id } });
      } else {
        const { data } = await api.post("/payments/razorpay/create", {
          orderItems: cart,
          shippingAddress: shipping,
        });
        const { order, razorpayOrder, keyId } = data;

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const options = {
            key: keyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "MyShop Checkout",
            description: `Order ${order._id}`,
            order_id: razorpayOrder.id,
            handler: async function (resp) {
              await api.post("/payments/razorpay/verify", {
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_signature: resp.razorpay_signature,
                orderId: order._id,
              });
              localStorage.removeItem("cart");
              navigate("/orders", { state: { orderId: order._id } });
            },
            prefill: {
              name: shipping.fullName,
              email: shipping.email,
            },
            theme: { color: "#4f46e5" },
          };
          new window.Razorpay(options).open();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-indigo-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ================= LEFT FORM ================= */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center lg:text-left">
            Checkout
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={placeOrder} className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={shipping.email}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                name="phone"
                value={shipping.phone}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Address
              </label>
              <input
                name="address"
                value={shipping.address}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  City
                </label>
                <input
                  name="city"
                  value={shipping.city}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Postal Code
                </label>
                <input
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Country
                </label>
                <input
                  name="country"
                  value={shipping.country}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Payment Method
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-indigo-400 transition">
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm">
                    Cash on Delivery (COD)
                  </span>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-indigo-400 transition">
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm">
                    Credit / Debit Card (Razorpay)
                  </span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="block text-center mt-3 text-sm text-indigo-600 hover:underline"
            >
              ← Return to Cart
            </Link>
          </form>
        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <div className="lg:w-1/3">
          <div className="bg-white/90 backdrop-blur-md border border-indigo-100 shadow-xl rounded-2xl p-6 sticky top-4">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">
              Order Summary
            </h3>

            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div
                  key={item.product}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-md object-contain bg-gray-50 border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-4 space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping_fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Secure SSL-encrypted checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
