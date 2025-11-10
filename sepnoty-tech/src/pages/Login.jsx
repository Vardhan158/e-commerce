import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    const { email, password, name, confirmPassword } = formData;

    if (!email || !password || (!isLogin && (!name || !confirmPassword)))
      return setError("Please fill in all fields");
    if (!isLogin && password !== confirmPassword)
      return setError("Passwords do not match");

    setIsLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "login" : "register";
      const response = await fetch(
        `https://e-commerce-zc68.onrender.com/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      localStorage.setItem("token", data.token);
      const userData = {
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("cart");

      navigate(data.user.isAdmin ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 🖼️ Left Illustration (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742041-427fe6b72b17?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 text-white text-center max-w-md px-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to MyShop</h1>
          <p className="text-sm md:text-base opacity-90">
            Discover amazing products and enjoy a seamless shopping experience.
          </p>
        </div>
      </div>

      {/* 🧾 Right Login Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-b from-white to-indigo-50">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-indigo-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-indigo-600">MyShop</span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
            </h2>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 text-sm text-red-600 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={submit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 text-sm font-medium text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-md transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By continuing, you agree to our{" "}
              <span className="text-indigo-600 hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-indigo-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
