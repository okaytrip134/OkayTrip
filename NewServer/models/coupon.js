// models/coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  couponNumber: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'success'
  },
  isWinner: { type: Boolean, default: false },
  associatedPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  isUsed: { type: Boolean, default: false }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Coupon', couponSchema);