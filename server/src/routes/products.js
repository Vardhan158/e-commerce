import express from "express";
import Product from "../models/Product.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   📦 GET: List All Products (Public)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // If no products found
    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        products: [],
        message: "No products found",
      });
    }

    // Format response
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

/* =====================================================
   📦 GET: Product Details by ID (Public)
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving product details",
      error: error.message,
    });
  }
});

/* =====================================================
   🛠️ POST: Add Product (Admin only)
===================================================== */
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      offerPrice,
      image,
      category,
      brand,
      stock,
      countInStock,
      rating,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // 🧹 Normalize input
    name = name.trim();
    description = description?.trim() || "";
    category = category?.trim() || "General";
    brand = brand?.trim() || "No Brand";
    price = parseFloat(price);
    offerPrice = offerPrice ? parseFloat(offerPrice) : price;
    countInStock = Number(countInStock || stock || 0);
    rating = Number(rating) || 0;

    // 🖼 Handle images
    const imagesArr = image
      ? [
          {
            url: image,
            public_id: req.body.public_id || undefined,
          },
        ]
      : [];

    // 🏗 Create product
    const product = await Product.create({
      name,
      description,
      price,
      offerPrice,
      category,
      brand,
      countInStock,
      rating,
      thumbnail: image || "",
      images: imagesArr,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

/* =====================================================
   ✏️ PUT: Update Product (Admin only)
===================================================== */
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };

    // Normalize numeric fields
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.offerPrice) updates.offerPrice = parseFloat(updates.offerPrice);
    if (updates.countInStock)
      updates.countInStock = Number(updates.countInStock);

    // If client updated a single image URL, map it to thumbnail/images
    if (updates.image) {
      updates.thumbnail = updates.image;
      updates.images = [
        {
          url: updates.image,
          public_id: updates.public_id || undefined,
        },
      ];
      delete updates.image;
      delete updates.public_id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
});

/* =====================================================
   ❌ DELETE: Delete Product (Admin only)
===================================================== */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Product '${product.name}' deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

export default router;
