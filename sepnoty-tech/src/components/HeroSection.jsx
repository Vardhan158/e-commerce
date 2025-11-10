import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Discover <span className="text-blue-600">Amazing Deals</span><br />
            on Your Favorite Products
          </h1>

          <p className="mt-5 text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
            Shop smart and save more! Explore the best-selling gadgets, fashion,
            and lifestyle products all in one place.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start gap-4">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/categories"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition"
            >
              Explore Categories
            </Link>
          </div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1607083206173-677ad39c28b2?q=80&w=1200&auto=format&fit=crop"
            alt="Shopping illustration"
            className="w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>
    </section>
  );
}
