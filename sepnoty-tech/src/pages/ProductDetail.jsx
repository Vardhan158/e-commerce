import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const images =
    product?.images && product.images.length > 0
      ? product.images.map((img) => img.url || img)
      : [
          product?.thumbnail ||
            "https://via.placeholder.com/300x200?text=Product+Image",
          "https://via.placeholder.com/300x200?text=Angle+2",
          "https://via.placeholder.com/300x200?text=Angle+3",
        ];

  const [thumbnail, setThumbnail] = useState(() => images[0]);

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-500 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-600 transition"
        >
          Back to Products
        </button>
      </div>
    );

  const descriptionArray = Array.isArray(product.description)
    ? product.description
    : [product.description || "No description available"];

  const handleAddToCart = async (buyNow = false) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.product === product.id);

      if (existingItem) existingItem.qty += 1;
      else
        cart.push({
          product: product.id,
          qty: 1,
          price: product.offerPrice,
          image: product.thumbnail || product.image,
          name: product.name,
        });

      localStorage.setItem("cart", JSON.stringify(cart));

      if (localStorage.getItem("token")) {
        await api.post("/auth/cart", { cart });
      }

      if (buyNow) {
        const singleItemCart = [
          {
            product: product.id,
            qty: 1,
            price: product.offerPrice,
            image: product.thumbnail || product.image,
            name: product.name,
          },
        ];
        localStorage.setItem("cart", JSON.stringify(singleItemCart));
        if (localStorage.getItem("token")) {
          await api.post("/auth/cart", { cart: singleItemCart });
        }
        navigate("/checkout");
      } else {
        alert("✅ Added to cart successfully!");
      }
    } catch (error) {
      console.error("Cart error:", error);
      alert("❌ Failed to add to cart. Try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 mb-6">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-indigo-500 transition"
          >
            Home
          </span>{" "}
          / <span>{product.category}</span> /{" "}
          <span className="text-indigo-500">{product.name}</span>
        </p>

        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image Gallery */}
          <div className="flex-1">
            {/* Mobile Slider */}
            <div className="block lg:hidden relative overflow-hidden rounded-2xl shadow-md mb-4">
              <img
                src={thumbnail}
                alt={product.name}
                className="w-full h-80 object-contain bg-white"
              />
              <div className="flex justify-center gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                  <img
                    key={i}
                    onClick={() => setThumbnail(img)}
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className={`w-16 h-16 object-contain border rounded-lg cursor-pointer transition-all ${
                      thumbnail === img
                        ? "border-indigo-500 shadow-md"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Gallery */}
            <div className="hidden lg:flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setThumbnail(img)}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      thumbnail === img
                        ? "border-indigo-500 ring-2 ring-indigo-200"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-20 object-contain bg-gray-50"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden w-[420px] h-[420px] shadow-lg bg-white flex items-center justify-center">
                <img
                  src={thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 text-gray-700">
            <h1 className="text-3xl font-semibold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="15"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                      fill={
                        product.rating > i ? "#615fff" : "rgba(97,95,255,0.3)"
                      }
                    />
                  </svg>
                ))}
              <span className="ml-2 text-sm text-gray-500">
                {product.rating} / 5
              </span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-gray-500 line-through">
                MRP: ₹{product.price?.toLocaleString()}
              </p>
              <p className="text-3xl font-bold text-indigo-600">
                ₹{product.offerPrice?.toLocaleString()}
              </p>
              <span className="text-gray-500 text-sm">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {product.countInStock > 0 ? (
                <span className="text-green-600 font-medium">
                  In Stock ({product.countInStock})
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-semibold text-lg mb-2 text-gray-900">
                Product Details
              </h2>
              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                {descriptionArray.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => handleAddToCart(false)}
                className="flex-1 py-3 font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                className="flex-1 py-3 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between gap-3 shadow-md sm:hidden z-50">
        <button
          onClick={() => handleAddToCart(false)}
          className="flex-1 py-2 font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
        >
          Add to Cart
        </button>
        <button
          onClick={() => handleAddToCart(true)}
          className="flex-1 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Buy Now
        </button>
      </div>
    </>
  );
};

export default ProductDetail;
