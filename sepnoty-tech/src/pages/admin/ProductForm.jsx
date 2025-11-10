import React, { useState } from "react";
import api from "../../api/api";
import { UploadCloud, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";

// Environment variables for Cloudinary
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
const API_BASE = (
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    offerPrice: "",
    description: "",
    category: "",
    rating: 5,
    stock: 0,
    thumbnail: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const formData = new FormData();
      formData.append("file", file);

      if (UPLOAD_PRESET) {
        formData.append("upload_preset", UPLOAD_PRESET);
        const res = await fetch(uploadUrl, { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");
        setForm((prev) => ({
          ...prev,
          image: data.secure_url,
          thumbnail: data.secure_url,
          images: [...prev.images, { url: data.secure_url }],
        }));
      } else {
        const signRes = await fetch(`${API_BASE}/upload/sign`);
        const signJson = await signRes.json();
        const { signature, timestamp, api_key } = signJson;
        formData.append("api_key", api_key);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const res = await fetch(uploadUrl, { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");
        setForm((prev) => ({
          ...prev,
          image: data.secure_url,
          thumbnail: data.secure_url,
          images: [...prev.images, { url: data.secure_url }],
        }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", form);
      alert("✅ Product added!");
      setForm({
        name: "",
        price: "",
        offerPrice: "",
        description: "",
        category: "",
        rating: 5,
        stock: 0,
        thumbnail: "",
        image: "",
        images: [],
      });
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white/70 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl p-6 sm:p-10 transition-all"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            Add New Product
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Fill in the product details below
          </p>
        </div>

        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Category</option>
              {[
                "Electronics",
                "Fashion",
                "Home & Living",
                "Sports",
                "Books",
                "Beauty",
                "Toys",
              ].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Price
            </label>
            <input
              type="number"
              name="offerPrice"
              value={form.offerPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (0 - 5)
          </label>
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="5.0"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Enter product description..."
          />
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 transition cursor-pointer bg-white/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="animate-spin text-indigo-600 mb-2" />
              ) : (
                <UploadCloud className="text-indigo-600 mb-2" />
              )}
              <p className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Click to upload or drag & drop"}
              </p>
            </label>
          </div>

          {form.thumbnail && (
            <div className="mt-4">
              <img
                src={form.thumbnail}
                alt="Preview"
                className="rounded-xl w-full max-h-64 object-contain border border-indigo-100 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Adding Product...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} /> Add Product
            </>
          )}
        </button>
      </form>
    </div>
  );
}
