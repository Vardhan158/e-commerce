import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlider = () => {
  const slides = [
    {
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide1.png",
      title: "Discover Stunning Collections",
      subtitle: "Shop smarter. Live better. Get the latest trends now.",
    },
    {
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png",
      title: "Tech that Empowers You ⚡",
      subtitle: "Upgrade your lifestyle with the latest gadgets.",
    },
    {
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png",
      title: "Style Meets Comfort 👗",
      subtitle: "Find your perfect outfit for every occasion.",
    },
    {
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png",
      title: "Your Dream Home Setup 🏠",
      subtitle: "Shop premium furniture and home accessories.",
    },
    {
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png",
      title: "Unbeatable Deals 🔥",
      subtitle: "Don’t miss out on our exclusive seasonal discounts!",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* ✅ Main Slider */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[currentSlide].image}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover rounded-none md:rounded-3xl shadow-2xl"
          />
        </AnimatePresence>

        {/* 🌈 Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-none md:rounded-3xl"></div>

        {/* ✨ Caption Text */}
        <motion.div
          key={slides[currentSlide].title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-10 left-6 sm:left-12 md:left-16 max-w-[90%] sm:max-w-md text-white"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug drop-shadow-lg">
            {slides[currentSlide].title}
          </h2>
          <p className="text-sm sm:text-base mt-2 text-gray-200 drop-shadow-md">
            {slides[currentSlide].subtitle}
          </p>

          <button className="mt-4 sm:mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">
            Shop Now →
          </button>
        </motion.div>
      </div>

      {/* 🟣 Dot Indicators */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <motion.span
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index
                ? "bg-indigo-600 scale-125 shadow-md"
                : "bg-gray-300/50 hover:bg-indigo-300/60"
            }`}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-0 w-56 h-56 bg-indigo-200 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-pink-200 rounded-full blur-3xl opacity-50 -z-10"></div>
    </section>
  );
};

export default HeroSlider;
