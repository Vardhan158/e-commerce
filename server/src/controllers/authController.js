import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import admin from "../config/firebaseAdmin.js";

/* =====================================================
   🔑 Helper Functions
===================================================== */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password.length >= 6;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =====================================================
   🧩 Register
===================================================== */
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!isValidPassword(password))
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email already registered. Please log in." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      lastLogin: Date.now(),
      cart: [],
    });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   🧩 Login
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.isGoogleUser)
      return res
        .status(401)
        .json({ message: "This account uses Google sign-in only." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   🧩 Google Sign-In
===================================================== */
export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Missing ID token" });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture, email_verified } = payload;
    if (!email_verified)
      return res.status(400).json({ message: "Google email not verified" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        password: null,
        isGoogleUser: true,
        avatar: picture,
        lastLogin: Date.now(),
      });
    } else {
      user.lastLogin = Date.now();
      user.isGoogleUser = true;
      await user.save();
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("❌ Google Sign-In error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

/* =====================================================
   👤 Get User Profile
===================================================== */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   🛒 Cart Management
===================================================== */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const saveCart = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart))
      return res.status(400).json({ message: "Cart must be an array" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = cart;
    await user.save();

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   🔒 Middleware: Firebase Token & Admin Guard
===================================================== */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization token missing" });

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Firebase token verification failed:", err);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await admin.auth().getUserByEmail(email);

    if (user.customClaims?.admin) return next();

    return res.status(403).json({ message: "Admin access required" });
  } catch (err) {
    console.error("❌ Admin verification error:", err);
    res.status(403).json({ message: "Admin access denied" });
  }
};
