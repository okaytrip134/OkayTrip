const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  sendOTP,
  verifyOTPAndResetPassword
} = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ OTP-Based Password Reset
router.post("/send-otp", sendOTP);
router.post("/reset-password-otp", verifyOTPAndResetPassword);

// Other Routes
router.get("/all", authMiddleware, getAllUsers);

module.exports = router;
