import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";
import {
  // User Management
  getAllUsers,
  deleteUser,

  // Order Management
  getAllOrders,
  updateOrderStatus,

  // Product Management
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminController.js";

const router = express.Router();

/* =====================================================
   👥 USER MANAGEMENT ROUTES
===================================================== */

/**
 * @route   GET /api/admin/users
 * @desc    Fetch all users (admin only)
 * @access  Private/Admin
 */
router.get("/users", protect, isAdmin, getAllUsers);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user (admin only)
 * @access  Private/Admin
 */
router.delete("/users/:id", protect, isAdmin, deleteUser);


/* =====================================================
   📦 ORDER MANAGEMENT ROUTES
===================================================== */

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (admin only)
 * @access  Private/Admin
 */
router.get("/orders", protect, isAdmin, getAllOrders);

/**
 * @route   PUT /api/admin/orders/:id
 * @desc    Update order status (admin only)
 * @access  Private/Admin
 */
router.put("/orders/:id", protect, isAdmin, updateOrderStatus);


/* =====================================================
   🛍️ PRODUCT MANAGEMENT ROUTES
===================================================== */

/**
 * @route   POST /api/admin/products
 * @desc    Create a new product (admin only)
 * @access  Private/Admin
 */
router.post("/products", protect, isAdmin, addProduct);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update existing product (admin only)
 * @access  Private/Admin
 */
router.put("/products/:id", protect, isAdmin, updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product (admin only)
 * @access  Private/Admin
 */
router.delete("/products/:id", protect, isAdmin, deleteProduct);


/* =====================================================
   🚀 FUTURE: Dashboard Analytics (optional)
===================================================== */
// Example:
// router.get("/stats", protect, isAdmin, getDashboardStats);

export default router;
