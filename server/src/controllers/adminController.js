import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =====================================================
   👑 ADMIN CONTROLLER
   Handles all admin operations (Users, Products, Orders)
===================================================== */

// 🧩 Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error fetching users" });
  }
};

// 🗑️ Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error deleting user" });
  }
};

// 🛒 Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
};

// 🔄 Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    if (status) order.status = status;
    if (typeof isPaid === "boolean") order.isPaid = isPaid;

    await order.save();
    res.json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ success: false, message: "Server error updating order" });
  }
};

// 📦 Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    const product = await Product.create({ name, description, price, image, category, stock });
    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error adding product" });
  }
};

// ✏️ Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error updating product" });
  }
};

// ❌ Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error deleting product" });
  }
};
