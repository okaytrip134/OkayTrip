const express = require("express");
const router = express.Router();
const authRouter = require("./authRouter");
const { getAllUsers, deleteUser } = require("../../controllers/userController"); // Import deleteUser function
const topSaleBarAdminRoutes = require("./topSaleBarAdminRoutes");
const authMiddleware = require("../../middlewares/authMiddleware");
const adminAuth = require("../../middlewares/adminAuth");
const categoryRoutes = require("./categoryRoutes");
const packageRoutes = require("./packageRoutes");
const bookingRoutes = require("./bookingRoutes"); // Import the new route
const bannerRoutes = require("./bannerRoutes");
const reviewRoutes = require("./reviewRoutes");

// Add all admin routes
router.use("/auth", authRouter); // Admin authentication routes
router.use("/top-sale-bar", topSaleBarAdminRoutes); // Top sale bar routes
router.get("/users", authMiddleware, adminAuth, getAllUsers); // Ensure correct middleware
router.delete("/users/:id", authMiddleware, adminAuth, deleteUser); // Add delete user route
router.use("/categories", categoryRoutes);
router.use("/packages", packageRoutes);
router.use("/bookings", bookingRoutes); // Add the booking route
router.use("/banner", bannerRoutes);
router.use("/reviews", reviewRoutes)

module.exports = router;
