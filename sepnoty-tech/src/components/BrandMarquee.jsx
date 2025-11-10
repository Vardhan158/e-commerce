import React from "react";

const BrandMarquee = () => {
  // ✅ Official brand logo image URLs
  const mobileBrands = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
    {
      name: "Xiaomi",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
    },
    {
      name: "OnePlus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/OnePlus_logo.svg",
    },
    {
      name: "Vivo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Vivo_logo.svg",
    },
    {
      name: "Oppo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/OPPO_logo.svg",
    },
    {
      name: "Realme",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Realme-realme-logo-box-RGB-01.svg",
    },
  ];

  return (
    <>
      {/* 🌀 Animation Styles */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          display: flex;
          animation: marqueeScroll linear infinite;
          will-change: transform;
        }

        /* ✋ Pause animation on hover */
        .marquee-inner:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 md:py-16 overflow-hidden border-t border-b border-gray-200">
        {/* 💎 Decorative background blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-indigo-50/70 to-white/60 backdrop-blur-sm pointer-events-none" />

        {/* 🌟 Section Heading */}
        <div className="relative text-center mb-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Trusted by <span className="text-indigo-600">Top Global Brands</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Powering innovation with our premium brand partners
          </p>
          <div className="mx-auto mt-3 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </div>

        {/* 🧩 Marquee Container */}
        <div className="relative overflow-hidden w-full">
          {/* Left & Right Fade Effects */}
          <div className="absolute left-0 top-0 h-full w-20 md:w-32 bg-gradient-to-r from-white via-white/70 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 h-full w-20 md:w-32 bg-gradient-to-l from-white via-white/70 to-transparent pointer-events-none z-10" />

          {/* 🎬 Logos Wrapper */}
          <div
            className="marquee-inner min-w-[200%] flex items-center justify-center gap-8 sm:gap-12 md:gap-16 px-8"
            style={{ animationDuration: "25s" }}
          >
            {[...mobileBrands, ...mobileBrands].map((brand, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center flex-shrink-0 group transition-all"
              >
                <div className="p-4 sm:p-6 md:p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-md hover:shadow-xl hover:bg-white/70 transition duration-300 ease-out flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 sm:h-10 md:h-14 object-contain opacity-80 group-hover:opacity-100 transition duration-300"
                    draggable={false}
                  />
                </div>
                <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mt-2 font-medium tracking-wide">
                  {brand.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🪶 Subtle bottom shadow for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 via-transparent to-transparent pointer-events-none" />
      </section>
    </>
  );
};

export default BrandMarquee;
