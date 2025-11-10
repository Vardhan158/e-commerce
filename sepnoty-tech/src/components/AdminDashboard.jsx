import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../pages/admin/AdminSidebar';
import AdminNavbar from '../pages/admin/AdminNavbar';
import api from '../api/api';

// Lazy-load heavy admin pages
const ProductList = lazy(() => import('../pages/admin/ProductList'));
const ProductForm = lazy(() => import('../pages/admin/ProductForm'));
const OrdersList = lazy(() => import('../pages/admin/OrdersList'));
const UserList = lazy(() => import('../pages/admin/UserList'));

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ products: 0, orders: 0, users: 0 });
  const navigate = useNavigate();

  // Guard: ensure logged user is admin
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user')) || null;
      if (!stored || !stored.isAdmin) {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch quick summary counts for the dashboard (non-blocking for detail pages)
  useEffect(() => {
    let mounted = true;

    const toArray = (r) => {
      if (!r) return [];
      if (Array.isArray(r)) return r;
      if (Array.isArray(r.data)) return r.data;
      if (Array.isArray(r.data?.data)) return r.data.data;
      if (Array.isArray(r.data?.products)) return r.data.products;
      return [];
    };

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const [prodRes, ordersRes, usersRes] = await Promise.all([
          api.get('/products'),
          api.get('/admin/orders'),
          api.get('/admin/users'),
        ]);

        if (!mounted) return;

        const products = toArray(prodRes);
        const orders = toArray(ordersRes);
        const users = toArray(usersRes);

        setSummary({ products: products.length, orders: orders.length, users: users.length });
        setError('');
      } catch (err) {
        console.error('Failed to load admin summary', err);
        if (mounted) setError(err.response?.data?.message || 'Failed to load admin data');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderView = () => {
    switch (activeTab) {
      case 'products':
        return (
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductList />
          </Suspense>
        );
      case 'addProduct':
        return (
          <Suspense fallback={<div>Loading form...</div>}>
            <ProductForm />
          </Suspense>
        );
      case 'orders':
        return (
          <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersList />
          </Suspense>
        );
      case 'users':
        return (
          <Suspense fallback={<div>Loading users...</div>}>
            <UserList />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductList />
          </Suspense>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeView={activeTab} setActiveView={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
                <p className="text-sm text-gray-500">Manage products, orders and users</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Products: <span className="font-medium">{summary.products}</span></div>
                <div className="text-sm text-gray-600">Orders: <span className="font-medium">{summary.orders}</span></div>
                <div className="text-sm text-gray-600">Users: <span className="font-medium">{summary.users}</span></div>
                <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
              </div>
            </div>

            {loading && <div className="mb-4 text-sm text-gray-500">Loading summary...</div>}
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;