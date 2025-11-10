import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   💳 CREATE RAZORPAY ORDER
===================================================== */
router.post("/razorpay/create", protect, async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ success: false, message: "Incomplete shipping address" });
    }

    let totalPrice = 0;
    const items = [];

    for (const item of orderItems) {
      let productDoc = null;

      try {
        productDoc = await Product.findById(item.product);
      } catch (e) {
        // ignore invalid IDs
      }

      if (!productDoc && item.name) {
        productDoc = await Product.findOne({ name: item.name });
      }

      if (productDoc) {
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
      } else {
        if (!item.name || typeof item.price !== "number") {
          return res.status(400).json({
            success: false,
            message: "Invalid product in cart",
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

    // Create unpaid order in DB
    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      totalPrice,
      isPaid: false,
    });

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // amount in paise
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: { orderId: order._id.toString(), email: req.user.email },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      message: "Razorpay order created successfully",
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
      order,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    next(error);
  }
});

/* =====================================================
   ✅ VERIFY RAZORPAY PAYMENT
===================================================== */
router.post("/razorpay/verify", protect, async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay verification fields",
      });
    }

    // Signature verification
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature. Payment not verified.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Order ID mismatch" });
    }

    // Mark as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpay_payment_id,
      method: "razorpay",
      status: "paid",
      raw: { razorpay_order_id, razorpay_signature },
    };
    await order.save();

    // Reduce product stock
    for (const item of order.orderItems) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          await product.save();
        }
      }
    }

    res.json({
      success: true,
      message: "Payment verified and order marked as paid",
      order,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    next(error);
  }
});

export default router;
