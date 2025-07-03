// controllers/discountController.js

const DiscountCoupon = require("../models/DiscountCoupon");
const Booking = require("../models/booking");

// ✅ Create a Discount Coupon (Admin)
exports.createDiscountCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      value,
      maxDiscount,
      minOrderAmount,
      expiresAt,
      usageLimitPerUser,
    } = req.body;

    if (!code || !discountType || !value || !expiresAt) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await DiscountCoupon.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new DiscountCoupon({
      code: code.toUpperCase(),
      discountType,
      value,
      maxDiscount,
      minOrderAmount,
      expiresAt,
      usageLimitPerUser,
    });

    await coupon.save();
    return res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.applyDiscountCoupon = async (req, res) => {
  try {
    const { code, userId, totalAmount, packageId } = req.body;

    if (!code || !userId || !totalAmount) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const coupon = await DiscountCoupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Fix: Changed expiryDate to expiresAt
    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon is expired" });
    }

    // Check if user has already used this coupon
    const userUsage = coupon.appliedUsers.find(u => u.userId.toString() === userId);
    if (userUsage && userUsage.usedCount >= coupon.usageLimitPerUser) {
      return res.status(400).json({ message: "You have reached the usage limit for this coupon" });
    }

    if (totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount should be ₹${coupon.minOrderAmount}` 
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "flat") {
      discountAmount = coupon.value; // Changed from discountValue to value
    } else if (coupon.discountType === "percentage") {
      discountAmount = (coupon.value / 100) * totalAmount; // Changed from discountValue to value
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    const finalAmount = totalAmount - discountAmount;

    return res.status(200).json({
      success: true,
      discountAmount,
      finalAmount,
      message: `Coupon applied successfully! You saved ₹${discountAmount}`,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllDiscountCoupons = async (req, res) => {
  try {
    const coupons = await DiscountCoupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// ✅ Delete a Coupon by ID (Admin)
exports.deleteDiscountCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DiscountCoupon.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

