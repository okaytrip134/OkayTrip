const express = require('express');
const router = express.Router();
const { createOffer, viewOffers, endOffer, viewCoupons, getLiveOffer, announceWinners, getWinners } = require('../../controllers/offerController');
const adminAuth = require('../../middlewares/adminAuth');
const { adminViewAllCoupons, adminViewOfferCoupons } = require('../../controllers/couponController');

// Create a new offer (Admin)
router.post('/create-offer', createOffer);

// View all live and past offers (Admin)
router.get('/view-offers', viewOffers);

// End an offer early (Admin)
router.post('/end-offer/:offerId', endOffer);
router.post('/view-coupon', viewCoupons)
// Route to fetch live offer
router.get('/current', getLiveOffer);
router.post('/:offerId/announce-winners', adminAuth, announceWinners);
router.get('/:offerId/coupons', adminAuth, adminViewOfferCoupons);
router.get('/winners', adminAuth, getWinners);
module.exports = router;
