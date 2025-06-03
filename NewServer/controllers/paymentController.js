const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables
const Counter = require("../models/counter"); // Make sure path is correct

const getNextBookingNumber = async () => {
  const result = await Counter.findOneAndUpdate(
    { name: "bookingId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(result.value).padStart(6, "0");
  return `OKB${padded}`;
};

// ✅ Initialize Razorpay with Correct API Keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const bookingId = await getNextBookingNumber();
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

    // ✅ Check if booking already exists
    const existingBooking = await Booking.findOne({ bookingId });

    if (existingBooking) {
      return res.status(200).json({
        success: true,
        message: "Booking already confirmed",
        booking: existingBooking,
      });
    }

    // ✅ Create new booking
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

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: newBooking,
    });
  } catch (error) {
    // ✅ Graceful handling of duplicate error (just in case)
    if (error.code === 11000 && error.keyPattern?.bookingId) {
      const fallbackBooking = await Booking.findOne({ bookingId });
      return res.status(200).json({
        success: true,
        message: "Duplicate booking (already saved)",
        booking: fallbackBooking,
      });
    }

    console.error("Booking Confirmation Error:", error);
    res.status(500).json({ success: false, message: "Booking confirmation failed" });
  }
};
