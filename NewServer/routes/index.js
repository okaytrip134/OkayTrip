const express = require("express");
const userAuthRoutes = require("./user/authRouter");
const profileRoutes = require("./user/profileRouter");
const adminRoutes = require("./admin/index");
const contactRouter = require("./user/contactRouter");
const paymentRoutes = require("./user/paymentRouter");
const bookingRoutes = require("./user/bookingRouter");


const router = express.Router();

// User Routes
router.use("/user/auth", userAuthRoutes);
router.use("/user/profile", profileRoutes);
router.use("/contact", contactRouter); // Add the contact route
router.use("/payment", paymentRoutes);
router.use("/bookings", bookingRoutes);
// Admin Routes
router.use("/admin", adminRoutes)
module.exports = router;
