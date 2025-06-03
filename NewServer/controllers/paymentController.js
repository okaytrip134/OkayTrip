const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables

// ✅ Initialize Razorpay with Correct API Keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

let bookingCounter = 1; // Resets if server restarts

exports.initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const bookingId = `OKB${String(bookingCounter++).padStart(6, "0")}`;
    console.log("Generated Booking ID:", bookingId);

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: bookingId,
      payment_capture: 1,
    });

    res.json({
      success: true,
      orderId: order.id,
      bookingId,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

// **Confirm Booking**
exports.confirmBooking = async (req, res) => {
  try {
    const { packageId, bookingId, paymentId, amount, paymentType } = req.body;
    const userId = req.user.id;

    const newBooking = new Booking({
      userId,
      packageId,
      bookingId,
      paymentId,
      amount,
      paymentType,
      status: "Confirmed",
    });

    await newBooking.save();

    res.json({ success: true, message: "Booking Confirmed", booking: newBooking });
  } catch (error) {
    console.error("Booking Confirmation Error:", error);
    res.status(500).json({ success: false, message: "Booking confirmation failed" });
  }
};
