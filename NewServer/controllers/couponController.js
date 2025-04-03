const Offer = require('../models/offer');
const Coupon = require('../models/coupon');
const razorpay = require('razorpay');
const mongoose = require('mongoose');
const { sendWinnerEmail } = require('../services/emailService');
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// User buys a coupon for a specific offer
exports.buyCoupon = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { paymentStatus, paymentId } = req.body;

    // Debugging: Log incoming request details
    console.log('Request user:', req.user);
    console.log('Offer ID:', offerId);
    console.log('Payment status:', paymentStatus);

    // Check if the offer exists
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      console.error('Authentication failed - no user in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Handle different payment statuses
    if (paymentStatus === 'pending') {
      const orderOptions = {
        amount: offer.price * 100,
        currency: 'INR',
        receipt: `order_rcptid_${Math.floor(Math.random() * 100000)}`,
      };

      const order = await razorpayInstance.orders.create(orderOptions);
      return res.status(200).json({
        message: 'Payment initiated',
        orderId: order.id
      });
    }
    else if (paymentStatus === 'success' && paymentId) {
      const coupon = new Coupon({
        offerId,
        userId: req.user.id,
        couponNumber: Math.floor(Math.random() * 1000000),
        paymentId, // Make sure this is included
        paymentStatus: 'success' // Explicitly set status
      });

      await coupon.save();

      // Admin report
      const adminReport = {
        userId: req.user.id,
        couponId: coupon._id,
        couponNumber: coupon.couponNumber,
        paymentId: paymentId,
        paymentStatus: 'success',
        offerId: offerId,
        createdAt: coupon.createdAt
      };

      console.log('Admin Report:', adminReport);
      return res.status(200).json({
        message: 'Coupon bought successfully',
        coupon
      });
    }
    else {
      return res.status(400).json({
        message: 'Invalid payment status or missing payment ID'
      });
    }

  } catch (saveError) {
    console.error('Error saving coupon:', saveError);
    return res.status(400).json({
      message: 'Failed to save coupon',
      error: saveError.message
    });
  }
};
// User views all purchased coupons
exports.viewCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ userId: req.user.id })
      .populate('offerId', 'title price endDate')
      .populate({
        path: 'associatedPackage',
        select: 'title' // Make sure this matches your Package model
      })
      .sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user coupons', 
      error: error.message 
    });
  }
};

exports.viewCouponStatus = async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!couponId) {
      return res.status(400).json({ message: "Coupon ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(couponId)) {
      return res.status(400).json({ message: "Invalid Coupon ID format" });
    }

    const coupon = await Coupon.findById(couponId)
      .populate('offerId', 'title price endDate')
      .populate({
        path: 'associatedPackage',
        select: 'title' // Make sure this matches your Package model
      });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};


// Admin views all coupons (for all users)
exports.adminViewAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('userId', 'email')
      .populate('offerId', 'title')
      .populate({
        path: 'associatedPackage',
        select: 'title' // Make sure this matches your Package model
      })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error });
  }
};
// Redeem coupon for package booking
exports.redeemCoupon = async (req, res) => {
  try {
    const { couponNumber, packageId } = req.body;
    const userId = req.user.id;
    const coupon = await Coupon.findOne({ 
      couponNumber,
      userId,
      isWinner: true,
      associatedPackage: packageId,
      isUsed: false
    }).populate('offerId');

    if (!coupon) {
      return res.status(400).json({ 
        message: 'Invalid coupon or not eligible for this package' 
      });
    }

    // Mark coupon as used
    coupon.isUsed = true;
    await coupon.save();

    res.status(200).json({ 
      message: 'Coupon redeemed successfully',
      discountAmount: coupon.offerId.price // Or full discount if package becomes free
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error redeeming coupon', 
      error: error.message 
    });
  }
};
// Admin views coupons for a specific offer
exports.adminViewOfferCoupons = async (req, res) => {
  try {
    const { offerId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ message: "Invalid Offer ID format" });
    }

    const coupons = await Coupon.find({ offerId })
      .populate('userId', 'email')
      .populate('offerId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching coupons for this offer', 
      error: error.message 
    });
  }
};