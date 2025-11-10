import User from "../models/User.js";
import Order from "../models/Order.js";

/* =====================================================
   👥 ADMIN: Get All Users
===================================================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("❌ getAllUsers error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

/* =====================================================
   👤 GET: Get User by ID (Admin or Owner)
===================================================== */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // If not admin, ensure it's the same user
    if (req.user.email !== process.env.ADMIN_EMAIL && req.user.id !== user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ getUserById error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: err.message,
    });
  }
};

/* =====================================================
   ✏️ UPDATE: User Profile (User or Admin)
===================================================== */
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id || req.user.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Only admin or owner can update
    if (req.user.email !== process.env.ADMIN_EMAIL && req.user.id !== user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const bcrypt = await import("bcryptjs");
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ updateUserProfile error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: err.message,
    });
  }
};

/* =====================================================
   ❌ DELETE: User (Admin Only)
===================================================== */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("❌ deleteUser error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message,
    });
  }
};

/* =====================================================
   📦 USER: Get My Orders
===================================================== */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ getUserOrders error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: err.message,
    });
  }
};

/* =====================================================
   📊 ADMIN: User Stats (Dashboard)
===================================================== */
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const googleUsers = await User.countDocuments({ isGoogleUser: true });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    res.json({
      success: true,
      message: "User stats fetched successfully",
      stats: {
        totalUsers,
        googleUsers,
        recentUsers,
      },
    });
  } catch (err) {
    console.error("❌ getUserStats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
      error: err.message,
    });
  }
};
