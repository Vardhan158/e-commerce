import mongoose from "mongoose";

/* =====================================================
   🏷️ Product Schema (for E-commerce Admin Panel)
===================================================== */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Description should be at least 10 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "General",
    },

    brand: {
      type: String,
      trim: true,
      default: "No Brand",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    countInStock: {
      type: Number,
      required: [true, "Stock count is required"],
      default: 0,
      min: [0, "Stock count cannot be negative"],
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // for Cloudinary deletion
      },
    ],

    thumbnail: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Track which admin added the product (optional)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Tags for search and SEO
    tags: [{ type: String, trim: true }],

    // Whether product is visible to users
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* =====================================================
   🔍 Indexes for Faster Search
===================================================== */
productSchema.index({ name: "text", description: "text", category: "text" });

/* =====================================================
   ⭐ Virtuals and Hooks
===================================================== */

// Virtual: price formatted with currency
productSchema.virtual("priceFormatted").get(function () {
  return `₹${this.price.toFixed(2)}`;
});

// Hook: prevent negative stock
productSchema.pre("save", function (next) {
  if (this.countInStock < 0) {
    this.countInStock = 0;
  }
  next();
});

/* =====================================================
   ✅ Export Model
===================================================== */
const Product = mongoose.model("Product", productSchema);
export default Product;
