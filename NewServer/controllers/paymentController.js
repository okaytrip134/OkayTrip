const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const Counter = require("../models/counter");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables

// ✅ Initialize Razorpay with Correct API Keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// **Initiate Payment**
exports.initiatePayment = async (req, res) => {
  try {
    const { packageId, packageTitle, amount, paymentType } = req.body;
    const userId = req.user.id;

    // ✅ Fetch the next booking number from MongoDB
    const counter = await Counter.findOneAndUpdate(
      { name: "bookingCounter" },
      { $inc: { value: 1 } },  // Increment counter by 1
      { new: true, upsert: true }  // Create if it doesn't exist
    );

    const bookingId = `OKB${String(counter.value).padStart(6, "0")}`;
    console.log("Generated Booking ID:", bookingId);

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    // ✅ Create the booking
    const newBooking = new Booking({
      bookingId,
      userId,
      packageId,
      amount,
      paymentType,
    });

    await newBooking.save();

    res.json({ success: true, bookingId, message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Failed to create booking" });
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
