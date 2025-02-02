const Booking = require("../models/booking");

exports.confirmBooking = async (req, res) => {
  try {
    const { packageId, bookingId, paymentId, amount, paymentType } = req.body;
    const userId = req.user.id; // Extract user ID from auth middleware

    const newBooking = new Booking({
      userId,
      packageId,
      bookingId,
      paymentId,
      amount,
      paymentType,
      status: "Confirmed", // Default status
    });

    await newBooking.save();

    res.json({ success: true, message: "Booking Confirmed", booking: newBooking });
  } catch (error) {
    console.error("Booking Confirmation Error:", error);
    res.status(500).json({ success: false, message: "Booking confirmation failed" });
  }
};
exports.getUserBookings = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from auth middleware
      const bookings = await Booking.find({ userId }).populate("packageId");
  
      res.json({ success: true, bookings });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
  };
  