const express = require("express");
const { confirmBooking } = require("../../controllers/bookingController");
const {getUserBookings} = require("../../controllers/bookingController")
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Confirm booking after payment
router.get("/", authMiddleware, getUserBookings);
router.post("/confirm", authMiddleware, confirmBooking);

module.exports = router;
