const express = require('express');
const router = express.Router();
const { buyCoupon, viewCoupons, viewCouponStatus, adminViewAllCoupons } = require('../../controllers/couponController');
const authMiddleware = require('../../middlewares/authMiddleware');
const validateObjectId = require('../../middlewares/validateObjectId');

// Add authMiddleware to all routes
router.post('/buy-coupon/:offerId', authMiddleware, buyCoupon);
router.get('/view-coupons', authMiddleware, viewCoupons);
router.get('/view-coupon/:couponId', validateObjectId('couponId'), viewCouponStatus);  // This is using _id to fetch the coupon
router.get('/admin/coupons', adminViewAllCoupons);

module.exports = router;
