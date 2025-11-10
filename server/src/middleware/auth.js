import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "firebase-admin";

/* =====================================================
   🚀 Initialize Firebase Admin (Only Once)
===================================================== */
if (!admin.apps.length) {
  try {
    let serviceAccount;
    
    // Try JSON from env
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (err) {
        // Fix escaped newline formatting
        const sanitized = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, "\n");
        serviceAccount = JSON.parse(sanitized);
      }
    }
    // Try file path
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      const filePath = join(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      serviceAccount = JSON.parse(readFileSync(filePath, 'utf8'));
    }
    // Try base64
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString();
      serviceAccount = JSON.parse(decoded);
    }
    else {
      throw new Error("No Firebase service account credentials found. Set FIREBASE_SERVICE_ACCOUNT, FIREBASE_SERVICE_ACCOUNT_PATH, or FIREBASE_SERVICE_ACCOUNT_B64");
    }

    // Fix private key formatting
    if (typeof serviceAccount.private_key === "string" && !serviceAccount.private_key.includes("\n")) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized for project:", serviceAccount.project_id);
  } catch (err) {
    console.error("❌ Firebase Admin initialization failed:", err.message);
  }
}

/* =====================================================
   🔒 Middleware: Protect (User Auth)
===================================================== */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let user;

    try {
      // 1️⃣ Try verifying Firebase ID Token
      const decodedFirebase = await admin.auth().verifyIdToken(token);
      user = await User.findOne({ email: decodedFirebase.email });

      // Auto-create Firebase user in MongoDB if missing
      if (!user) {
        const isAdmin = decodedFirebase.email === process.env.ADMIN_EMAIL || decodedFirebase.admin === true;
        user = await User.create({
          name: decodedFirebase.name || decodedFirebase.email.split("@")[0],
          email: decodedFirebase.email,
          isGoogleUser: true,
          firebaseUID: decodedFirebase.uid,
          isAdmin,
          authProvider: 'firebase'
        });
      }

      req.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || user.email === process.env.ADMIN_EMAIL || decodedFirebase.admin === true,
        firebaseUID: decodedFirebase.uid,
      };
      return next();
    } catch (firebaseError) {
      // 2️⃣ Fallback: JWT verification
      const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decodedJWT.id).select("-password");

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      req.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.email === process.env.ADMIN_EMAIL,
      };
      return next();
    }
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed: " + (error.message || "Invalid token"),
    });
  }
};

/* =====================================================
   👑 Middleware: Admin Check
===================================================== */
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1️⃣ Check Firebase custom claim
    try {
      const firebaseUser = await admin.auth().getUserByEmail(req.user.email);
      if (firebaseUser.customClaims?.admin === true) {
        req.user.isAdmin = true;
        return next();
      }
    } catch (err) {
      // Ignore Firebase errors and check manually
    }

    // 2️⃣ Fallback: .env ADMIN_EMAIL check
    if (req.user.email === process.env.ADMIN_EMAIL) {
      req.user.isAdmin = true;
      return next();
    }

    // 🚫 Deny access if not admin
    return res.status(403).json({ success: false, message: "Admin access required" });
  } catch (err) {
    console.error("❌ Admin middleware error:", err);
    res.status(403).json({ success: false, message: "Admin access denied" });
  }
};
