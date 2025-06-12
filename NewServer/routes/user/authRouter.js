const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  sendOTP,
  verifyOTPAndResetPassword,
  verifyOnlyOTP,
  googleAuth,
  checkGoogleUser
} = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ OTP-Based Password Reset
router.post("/send-otp", sendOTP);
router.post("/reset-password-otp", verifyOTPAndResetPassword);
router.post("/verify-otp", verifyOnlyOTP);
// Add these routes after the existing ones
router.post("/google-auth", googleAuth);
router.post("/check-google-user", checkGoogleUser);
// Other Routes
router.get("/all", authMiddleware, getAllUsers);

module.exports = router;
