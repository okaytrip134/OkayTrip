// models/DiscountCoupon.js

const mongoose = require("mongoose");

const discountCouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  maxDiscount: {
    type: Number, // for percentage coupons
    default: null,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  usageLimitPerUser: {
    type: Number,
    default: 1,
  },
  appliedUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      usedCount: {
        type: Number,
        default: 1,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("DiscountCoupon", discountCouponSchema);
