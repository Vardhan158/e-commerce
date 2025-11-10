import React from "react";

const Banner = () => {
  return (
    <div className="w-full relative overflow-hidden text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-2.5 md:py-3 shadow-lg border-b border-white/20">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md pointer-events-none"></div>

      {/* Marquee Wrapper */}
      <div className="relative flex items-center justify-center">
        <p
          className="whitespace-nowrap animate-marquee text-sm sm:text-base md:text-lg font-semibold tracking-wide drop-shadow-md hover:[animation-play-state:paused] cursor-pointer"
        >
          🚚 Free Shipping on Orders Above ₹999! &nbsp; | &nbsp; 💥 20% OFF on
          Your First Purchase &nbsp; | &nbsp; 🎁 Exciting New Arrivals Every
          Week! &nbsp; | &nbsp; 🔥 Limited Time Offers! &nbsp; | &nbsp; 🌟 Shop
          Smart. Shop MyShop.
        </p>
      </div>

      {/* ✅ Inline CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }

        /* 🖥️ Pause on hover */
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* 📱 Responsive text speed */
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }

        @media (min-width: 1024px) {
          .animate-marquee {
            animation-duration: 12s;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
