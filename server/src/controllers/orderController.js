import Order from "../models/Order.js";

/* =====================================================
   🧾 ADMIN: Get All Orders
===================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "All orders fetched successfully",
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ getAllOrders error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

/* =====================================================
   🔄 ADMIN: Update Order Status
===================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Order status is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to '${status}'`,
      order,
    });
  } catch (err) {
    console.error("❌ updateOrderStatus error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: err.message,
    });
  }
};

/* =====================================================
   🧍 USER: Get My Orders
===================================================== */
export const getUserOrders = async (req, res) => {
  try {
    // Support both Firebase UID & JWT user ID
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({
      $or: [{ "user.uid": userId }, { user: userId }],
    })
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.json({
        success: true,
        message: "No orders found for this user",
        orders: [],
      });
    }

    res.json({
      success: true,
      message: "Orders fetched successfully",
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
   📦 ADMIN: Delete an Order (optional utility)
===================================================== */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("❌ deleteOrder error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: err.message,
    });
  }
};
