import Product from "../models/Product.js";

/* =====================================================
   🧾 GET: All Products (Public)
   Supports optional query filters: ?category=Shoes&search=nike
===================================================== */
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    // 🔍 Filters
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("❌ getProducts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

/* =====================================================
   🔍 GET: Single Product by ID (Public)
===================================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    console.error("❌ getProductById error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: err.message,
    });
  }
};

/* =====================================================
   ➕ POST: Add New Product (Admin Only)
===================================================== */
export const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      offerPrice,
      stock,
      category,
      brand,
      rating,
      image,
      images,
    } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Name and price are required" });
    }

    // 🧹 Normalize and sanitize
    name = name.trim();
    description = description?.trim() || "";
    category = category?.trim() || "General";
    brand = brand?.trim() || "No Brand";
    price = parseFloat(price);
    offerPrice = offerPrice ? parseFloat(offerPrice) : price;
    const countInStock = Number(stock) || 0;
    rating = Number(rating) || 0;

    // 🖼 Image normalization
    let imagesArray = [];
    if (Array.isArray(images) && images.length > 0) {
      imagesArray = images.map((img) => ({
        url: img.url || img,
        public_id: img.public_id || undefined,
      }));
    } else if (image) {
      imagesArray = [{ url: image, public_id: req.body.public_id || undefined }];
    }

    // 🏗 Create Product
    const product = await Product.create({
      name,
      description,
      price,
      offerPrice,
      category,
      brand,
      countInStock,
      rating,
      thumbnail: imagesArray[0]?.url || "",
      images: imagesArray,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("❌ createProduct error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: err.message,
    });
  }
};

/* =====================================================
   ✏️ PUT: Update Product (Admin Only)
===================================================== */
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    // 🧮 Normalize numeric values
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.offerPrice) updates.offerPrice = parseFloat(updates.offerPrice);
    if (updates.countInStock)
      updates.countInStock = Number(updates.countInStock);
    if (updates.rating) updates.rating = Number(updates.rating);

    // 🖼 Handle single image
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

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("❌ updateProduct error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: err.message,
    });
  }
};

/* =====================================================
   ❌ DELETE: Delete Product (Admin Only)
===================================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: `Product '${product.name}' deleted successfully`,
    });
  } catch (err) {
    console.error("❌ deleteProduct error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: err.message,
    });
  }
};

/* =====================================================
   🧮 GET: Count All Products (Admin Dashboard Widget)
===================================================== */
export const getProductStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ countInStock: { $lte: 0 } });

    res.status(200).json({
      success: true,
      message: "Product stats fetched successfully",
      total,
      outOfStock,
    });
  } catch (err) {
    console.error("❌ getProductStats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product stats",
      error: err.message,
    });
  }
};
