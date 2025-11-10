// adminSeeder.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

/* =====================================================
   🎯 Admin Seeder - Create or Update Admin User
===================================================== */
async function main() {
  try {
    console.log("🚀 Starting admin user creation...");

    // Load environment variables
    const { ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("📦 Connected to MongoDB");

    // Delete existing admin if exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("🧹 Existing admin found — deleting...");
      await User.deleteOne({ email: ADMIN_EMAIL });
    }

    // Create new admin user (password hashed via pre-save hook)
    const admin = new User({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      isAdmin: true,
      role: "admin",
    });

    await admin.save();
    console.log("✨ Created new admin user");
    console.log("📧 Email:", ADMIN_EMAIL);
    console.log("🔑 Password:", ADMIN_PASSWORD);

    // Verify password
    const verifyAdmin = await User.findOne({ email: ADMIN_EMAIL }).select("+password");
    if (!verifyAdmin) throw new Error("Admin not found after creation");

    const isMatch = await verifyAdmin.matchPassword(ADMIN_PASSWORD);
    console.log("🔐 Password verification:", isMatch ? "✅ Success" : "❌ Failed");

  } catch (error) {
    console.error("❌ Error creating/updating admin:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
      console.log("📦 Disconnected from MongoDB");
    } catch (e) {
      console.error("⚠️ Error during disconnect:", e.message);
    }

    // Exit cleanly
    process.exit(process.exitCode || 0);
  }
}

// Run script
main();
