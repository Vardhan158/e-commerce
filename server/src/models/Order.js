import mongoose from "mongoose";

/* =====================================================
   🛍️ Order Item Schema
===================================================== */
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/* =====================================================
   📦 Order Schema
===================================================== */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        "Order must contain at least one item",
      ],
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },

    paymentMethod: {
      type: String,
      enum: ["Razorpay", "COD", "Stripe"],
      default: "Razorpay",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    paymentResult: {
      id: String, // Razorpay payment_id or Stripe charge ID
      status: String,
      method: String,
      email: String,
      amount: Number,
      raw: Object,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   ⚙️ Indexing and Virtuals
===================================================== */
// For faster admin queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Virtual for readable order summary
orderSchema.virtual("itemCount").get(function () {
  return this.orderItems.reduce((acc, item) => acc + item.qty, 0);
});

/* =====================================================
   🧾 Pre-Save Hooks
===================================================== */
orderSchema.pre("save", function (next) {
  if (this.isPaid && !this.paidAt) {
    this.paidAt = Date.now();
  }
  if (this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
  next();
});

/* =====================================================
   ✅ Export Model
===================================================== */
export default mongoose.model("Order", orderSchema);
