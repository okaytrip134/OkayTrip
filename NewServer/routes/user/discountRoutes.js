// routes/discountRoutes.js

const express = require("express");
const {
  createDiscountCoupon,
  getAllDiscountCoupons,
  deleteDiscountCoupon,
  applyDiscountCoupon,
} = require("../../controllers/discountController");

const router = express.Router();

// Admin Routes
router.post("/create", createDiscountCoupon); // Create a coupon
router.get("/", getAllDiscountCoupons);        // List all coupons
router.delete("/:id", deleteDiscountCoupon);   // Delete a coupon by ID

// Public Route
router.post("/apply", applyDiscountCoupon);    // Apply coupon on booking

module.exports = router;
