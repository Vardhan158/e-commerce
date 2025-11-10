import React, { useEffect, useState } from "react";
import api from "../../api";
import { Trash2, RefreshCw, Mail, User } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Error deleting user", err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-indigo-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
        <strong>Error:</strong> {error}
        <button
          onClick={fetchUsers}
          className="mt-3 bg-red-100 hover:bg-red-200 px-4 py-1 rounded text-sm text-red-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-lg border border-indigo-100 rounded-2xl shadow-lg p-6 sm:p-10 transition-all">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            User Management
          </h2>
          <button
            onClick={fetchUsers}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow transition-all"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* User Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-700">
            <thead className="bg-indigo-50 text-indigo-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-indigo-50/40 transition-all duration-200"
                >
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold uppercase">
                      {user.name?.[0] || "?"}
                    </div>
                    <span className="font-medium text-gray-800">
                      {user.name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3 capitalize text-gray-600">
                    {user.role || "User"}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Cards (Mobile) */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-indigo-100 rounded-xl shadow-sm p-4 flex flex-col gap-3 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold uppercase">
                    {user.name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail size={12} /> {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <User size={12} />
                Role:{" "}
                <span className="font-medium capitalize text-gray-700">
                  {user.role || "User"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
