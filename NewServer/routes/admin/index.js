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
const leadRoutes = require('./leadRoutes');
const offerRoutes = require('./offerRoutes')

// Add all admin routes
router.use("/auth", authRouter); 
router.use("/top-sale-bar", topSaleBarAdminRoutes); 
router.get("/users", authMiddleware, adminAuth, getAllUsers); 
router.delete("/users/:id", authMiddleware, adminAuth, deleteUser); 
router.use("/categories", categoryRoutes);
router.use("/packages", packageRoutes);
router.use("/bookings", bookingRoutes); 
router.use("/banner", bannerRoutes);
router.use("/reviews", reviewRoutes);
router.use("/leads", leadRoutes); 
router.use("/offer", offerRoutes)
router.use("/blogs", require("./blogRoutes"))

module.exports = router;
