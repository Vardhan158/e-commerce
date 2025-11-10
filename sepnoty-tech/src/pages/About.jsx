import React from "react";

export default function About() {
  return (
    <>
      {/* Import Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* 🌈 Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 text-center px-6 overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 leading-tight">
          About <span className="text-indigo-500">MyShop</span>
        </h1>
        <p className="text-slate-600 mt-3 text-base md:text-lg max-w-xl mx-auto">
          We’re redefining online shopping — with innovation, trust, and a customer-first approach.
        </p>

        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      </section>

      {/* 🛍 About Brand */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <img
            src="https://images.unsplash.com/photo-1607083206173-677ad39c28b2?q=80&w=800&auto=format&fit=crop"
            alt="Shopping"
            className="rounded-2xl shadow-2xl w-full md:w-1/2 hover:scale-[1.02] transition-transform duration-500"
          />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Who We Are</h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              At <span className="font-semibold text-indigo-600">MyShop</span>, we are on a mission to make online shopping fast, delightful, and affordable.
              With a wide range of trusted brands, secure checkout, and smooth delivery, we aim to provide every customer the joy of effortless shopping — anytime, anywhere.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8">
              {[
                { label: "Happy Customers", value: "1M+" },
                { label: "Top Brands", value: "500+" },
                { label: "Orders Daily", value: "10K+" },
                { label: "Support", value: "24/7" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-indigo-100 shadow-sm hover:shadow-lg hover:bg-white transition-all"
                >
                  <h3 className="text-2xl font-bold text-indigo-600">{item.value}</h3>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 💡 Mission & Values */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-indigo-700">Our Mission & Values</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-3 text-sm md:text-base">
            Building a smarter and more sustainable shopping ecosystem where technology meets convenience and trust.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: "Innovation",
                img: "https://img.icons8.com/color/48/idea--v1.png",
                desc: "We continuously evolve to bring smarter shopping solutions.",
              },
              {
                title: "Customer First",
                img: "https://img.icons8.com/color/48/customer-insight.png",
                desc: "Every product and idea starts with our customers in mind.",
              },
              {
                title: "Sustainability",
                img: "https://img.icons8.com/color/48/planet-earth.png",
                desc: "We believe in eco-conscious shopping and responsible logistics.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <img src={v.img} alt={v.title} className="mx-auto mb-3 h-12" />
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 Meet the Team */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-indigo-700">Meet Our Team</h2>
        <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-sm md:text-base">
          Our team is passionate about making your online shopping experience better every day.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-10">
          {[
            { name: "Harsha", role: "Founder & CEO" },
            { name: "Priya", role: "UI/UX Designer" },
            { name: "Amit", role: "Full-Stack Developer" },
            { name: "Sara", role: "Marketing Lead" },
          ].map((person, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md py-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <img
                src={`https://i.pravatar.cc/150?img=${i + 10}`}
                alt={person.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 mb-3"
              />
              <h4 className="font-semibold text-slate-700">{person.name}</h4>
              <p className="text-xs text-slate-500">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💬 Customer Reviews */}
      <section className="bg-white py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-56 h-56 bg-indigo-100 rounded-full blur-3xl opacity-40 -z-10"></div>
        <h2 className="text-3xl font-bold text-indigo-700">What Our Customers Say</h2>
        <p className="text-slate-500 max-w-md mx-auto mt-3 text-sm md:text-base">
          Hear from our loyal customers who love shopping with us.
        </p>

        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              name: "Neha S.",
              review: "The best shopping experience ever! Fast delivery and beautiful packaging.",
            },
            {
              name: "Rohit K.",
              review: "MyShop is my go-to for deals. The customer support is excellent!",
            },
            {
              name: "Divya P.",
              review: "Love the UI! So clean and easy to browse products. 10/10!",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="relative bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm text-left hover:shadow-md transition"
            >
              <svg
                className="absolute top-4 left-4 w-6 h-6 text-indigo-400 opacity-30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.17 10.42A4.42 4.42 0 0 1 11.59 6a4.42 4.42 0 0 1 4.42 4.42v1.16a4.42 4.42 0 0 1-4.42 4.42 4.42 4.42 0 0 1-4.42-4.42v-1.16z" />
              </svg>
              <p className="text-slate-600 italic text-sm mb-4 mt-2">
                “{r.review}”
              </p>
              <h4 className="font-semibold text-indigo-600 text-sm">– {r.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-center text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-30 -z-10"></div>

        <h2 className="text-2xl md:text-3xl font-semibold">
          Join the Future of Online Shopping
        </h2>
        <p className="mt-2 text-indigo-100 text-sm md:text-base">
          Explore exclusive offers and the best experience with MyShop.
        </p>
        <button className="mt-6 bg-white text-indigo-600 font-medium px-8 py-3 rounded-full shadow-md hover:bg-indigo-50 transition-transform transform hover:scale-105">
          Start Shopping
        </button>
      </section>
    </>
  );
}
