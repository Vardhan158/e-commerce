import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-indigo-50 via-white to-purple-50 border-t border-gray-200 text-gray-600">
      {/* 🌈 Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-40 -z-10"></div>

      {/* 🏢 Top Section */}
      <div className="max-w-7xl mx-auto py-14 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* 🏪 Company Info */}
        <div className="space-y-4">
          <img
            src="/logo.png"
            alt="MyShop logo"
            className="h-10 w-auto"
          />
          <p className="text-sm leading-relaxed text-gray-500">
            MyShop brings you the latest phones and accessories at unbeatable
            prices. Discover new arrivals, offers, and trusted brands — all in one
            place.
          </p>

          {/* 🌐 Social Icons */}
          <div className="flex items-center gap-3 mt-4 text-gray-700">
            {[
              {
                label: "Instagram",
                svg: (
                  <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
                ),
              },
              {
                label: "Facebook",
                svg: (
                  <path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" />
                ),
              },
              {
                label: "Twitter",
                svg: (
                  <path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" />
                ),
              },
              {
                label: "LinkedIn",
                svg: (
                  <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
                ),
              },
            ].map((icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={icon.label}
                className="hover:text-indigo-600 transition-transform hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {icon.svg}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* 🧭 Company Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {["About", "Careers", "Press", "Blog", "Partners"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-indigo-600 hover:translate-x-1 inline-block transition-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 🧰 Support Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Support</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Help Center",
              "Safety Information",
              "Cancellation Options",
              "Contact Us",
              "Accessibility",
            ].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-indigo-600 hover:translate-x-1 inline-block transition-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 📨 Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Stay Updated</h3>
          <p className="mt-3 text-sm">
            Subscribe to our newsletter for exclusive offers and new arrivals.
          </p>

          <div className="mt-4 flex items-center bg-white/60 backdrop-blur-sm border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 overflow-hidden max-w-xs">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
            />
            <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full transition-colors mr-1">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 🌙 Divider */}
      <hr className="border-gray-300 mt-4" />

      {/* 🧾 Bottom Section */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto py-5 px-6 md:px-16 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="/"
            className="font-semibold text-indigo-600 hover:underline"
          >
            MyShop
          </a>
          . All rights reserved.
        </p>

        <ul className="flex items-center gap-4 mt-3 md:mt-0">
          {["Privacy", "Terms", "Sitemap"].map((link) => (
            <li key={link}>
              <a href="#" className="hover:text-indigo-600 transition">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
