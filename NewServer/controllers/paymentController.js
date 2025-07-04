const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const Counter = require("../models/counter");
require("dotenv").config();

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate unique padded booking ID
const getNextBookingNumber = async () => {
  const result = await Counter.findOneAndUpdate(
    { name: "bookingId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `OKB${String(result.value).padStart(6, "0")}`;
};

// ✅ 1. Initiate Razorpay Order (NO bookingId generated here)
exports.initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `TEMP-${Date.now()}`, // temporary unique value
      payment_capture: 1,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

// ✅ 2. Confirm Booking — this is where bookingId is generated
exports.confirmBooking = async (req, res) => {
  try {
    const { packageId, paymentId, amount, paymentType } = req.body;
    const userId = req.user.id;

    const bookingId = await getNextBookingNumber();

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
    if (error.code === 11000 && error.keyPattern?.bookingId) {
      const existing = await Booking.findOne({ bookingId: error.keyValue.bookingId });
      return res.status(200).json({
        success: true,
        message: "Booking already saved (duplicate handled)",
        booking: existing,
      });
    }

    console.error("Booking Confirmation Error:", error);
    res.status(500).json({ success: false, message: "Booking confirmation failed" });
  }
};
