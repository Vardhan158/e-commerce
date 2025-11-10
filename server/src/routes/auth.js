import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   � USER REGISTRATION
===================================================== */
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user - password will be hashed by pre-save middleware
    const user = await User.create({
      name,
      email,
      password, // Raw password - will be hashed by User model pre-save
      authProvider: "local",
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
});

/* =====================================================
   🔑 USER LOGIN
===================================================== */
/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("👉 Login attempt for:", email);

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ User found:", user.email);
    
    if (!user.password) {
      console.log("❌ No password stored for user");
      return res.status(401).json({
        success: false,
        message: "Invalid login method",
      });
    }

    // Verify password
    console.log('🔍 Attempting password verification');
    console.log('📝 Received password:', password);
    console.log('📝 Received password length:', password.length);
    console.log('💾 Stored hash:', user.password);
    console.log('💾 Stored hash length:', user.password.length);

    // Verify password using compare
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      console.log("📊 Password comparison result:", isMatch);
      
      // For debugging only - remove in production
      const testHash = await bcrypt.hash(password, 10);
      console.log("🔍 Test hash of received password:", testHash);
      
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ Password verified for:", email);

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
});

/* =====================================================
   �🔍 CHECK ADMIN STATUS
===================================================== */
/**
 * @route   POST /api/auth/check-admin
 * @desc    Verify if the logged-in user is an admin
 * @access  Private
 */
router.post("/check-admin", protect, async (req, res) => {
  try {
    const userEmail = req.body.email || req.user?.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required to verify admin status",
        isAdmin: false,
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        isAdmin: false,
      });
    }

    // Check admin flag
    const isAdmin = user.isAdmin === true;

    res.status(200).json({
      success: true,
      isAdmin,
      message: isAdmin
        ? "✅ User has admin privileges"
        : "🚫 User is not an admin",
    });
  } catch (error) {
    console.error("❌ Error checking admin status:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while checking admin status",
      isAdmin: false,
      error: error.message,
    });
  }
});

/* =====================================================
   🛒 CART MANAGEMENT
===================================================== */

/**
 * @route   GET /api/auth/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get("/cart", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cart: user.cart || [],
    });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
});

/**
 * @route   POST /api/auth/cart
 * @desc    Update user's cart
 * @access  Private
 */
router.post("/cart", protect, async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({
        success: false,
        message: "Cart must be an array",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update cart
    user.cart = cart;
    await user.save();

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart",
    });
  }
});

export default router;
