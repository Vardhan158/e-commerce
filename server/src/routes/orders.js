import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   🛒 CREATE NEW ORDER
===================================================== */
router.post("/", protect, async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ success: false, message: "Shipping address is incomplete" });
    }

    let totalPrice = 0;
    const items = [];

    for (const item of orderItems) {
      let productDoc = null;

      // Try finding the product by ID or fallback to name
      if (item.product) {
        try {
          productDoc = await Product.findById(item.product);
        } catch (err) {
          // Ignore invalid ObjectId formats
        }
      }
      if (!productDoc && item.name) {
        productDoc = await Product.findOne({ name: item.name });
      }

      if (productDoc) {
        // Ensure valid stock and consistent price
        if (item.qty > productDoc.countInStock) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${productDoc.name}`,
          });
        }

        totalPrice += productDoc.price * item.qty;

        items.push({
          product: productDoc._id,
          name: productDoc.name,
          qty: item.qty,
          price: productDoc.price,
          image: productDoc.image,
        });

        // Reduce stock safely
        productDoc.countInStock -= item.qty;
        await productDoc.save();
      } else {
        // Handle fallback items (not in DB)
        if (!item.name || typeof item.price !== "number") {
          return res.status(400).json({
            success: false,
            message: "Invalid product data in cart",
          });
        }

        totalPrice += item.price * item.qty;
        items.push({
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image || "",
        });
      }
    }

    const newOrder = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      totalPrice,
      isPaid: false,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    next(error);
  }
});

/* =====================================================
   📦 GET MY ORDERS (USER)
===================================================== */
router.get("/mine", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name');

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'No orders found'
      });
    }

    res.json({ 
      success: true, 
      orders: Array.isArray(orders) ? orders : [] 
    });
  } catch (error) {
    console.error("❌ Fetching user orders failed:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

/* =====================================================
   📦 GET SINGLE ORDER BY ID
===================================================== */
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Ensure that only admin or owner can view the order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Fetching single order failed:", error);
    next(error);
  }
});

/* =====================================================
   💳 MARK ORDER AS PAID (After Razorpay Payment)
===================================================== */
router.put("/:id/pay", protect, async (req, res, next) => {
  try {
    const { paymentResult } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult || {};

    await order.save();

    res.json({ success: true, message: "Payment recorded", order });
  } catch (error) {
    console.error("❌ Payment update failed:", error);
    next(error);
  }
});

export default router;
