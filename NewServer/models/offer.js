const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  bannerImage: String,
  title:String,
  totalCoupons: Number,
  price: Number,
  endDate: Date,
  grandPrize: String,  // Will be updated on the winner announcement
  status: { type: String, default: 'live' }
});

module.exports = mongoose.model('Offer', offerSchema);
