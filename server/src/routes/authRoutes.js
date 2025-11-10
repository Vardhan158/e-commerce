import express from "express";
import {
  register,
  login,
  googleSignIn,
  getUserProfile,
  getCart,
  saveCart,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* =====================================================
   🧩 AUTHENTICATION ROUTES
===================================================== */

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login existing user
// @access  Public
router.post("/login", login);

// @route   POST /api/auth/google
// @desc    Google OAuth sign-in
// @access  Public
router.post("/google", googleSignIn);

/* =====================================================
   👤 USER PROFILE
===================================================== */

// @route   GET /api/auth/profile
// @desc    Get user profile (requires token)
// @access  Private
router.get("/profile", protect, getUserProfile);

/* =====================================================
   🛒 USER CART
===================================================== */

// @route   GET /api/auth/cart
// @desc    Get current user cart
// @access  Private
router.get("/cart", protect, getCart);

// @route   POST /api/auth/cart
// @desc    Save or update cart
// @access  Private
router.post("/cart", protect, saveCart);

/* =====================================================
   🚪 LOGOUT
===================================================== */

// @route   POST /api/auth/logout
// @desc    Logout user (client should clear token)
// @access  Private
router.post("/logout", protect, (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

/* =====================================================
   👑 ADMIN CHECK (Optional)
===================================================== */

// @route   POST /api/auth/check-admin
// @desc    Check if a user is admin
// @access  Private
router.post("/check-admin", protect, async (req, res) => {
  try {
    const userEmail = req.body.email || req.user?.email;
    if (!userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required", isAdmin: false });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", isAdmin: false });
    }

    res.json({
      success: true,
      isAdmin: user.isAdmin === true,
      message:
        user.isAdmin === true
          ? "✅ User is an admin"
          : "🚫 User does not have admin rights",
    });
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying admin status",
      isAdmin: false,
      error: error.message,
    });
  }
});

export default router;
