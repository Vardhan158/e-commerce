import axios from 'axios';

/**
 * 🧩 Axios instance for all API calls
 * Automatically includes JWT tokens from localStorage
 * and handles environment-based URLs.
 */
const api = axios.create({
  // 🌍 Use Vite environment variable or fallback to localhost
  baseURL: import.meta.env.VITE_API_URL?.trim() || 'https://e-commerce-zc68.onrender.com/api',

  // Ensure cookies & credentials can be passed if needed
  withCredentials: false,
});

/**
 * 🛡️ Request interceptor
 * Automatically attach Bearer token to every request if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ⚠️ Response interceptor
 * Handles global 401s (unauthorized) or expired tokens
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized — token may have expired');
      // Do not remove token automatically. Only remove on explicit logout.
      // Optionally, you can show a message or redirect to login page here.
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
