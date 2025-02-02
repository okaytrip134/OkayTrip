const express = require("express");
const { initiatePayment, confirmBooking } = require("../../controllers/PaymentController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/payment", authMiddleware, initiatePayment);
router.post("/confirm-booking", authMiddleware, confirmBooking);

module.exports = router;