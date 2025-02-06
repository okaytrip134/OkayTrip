const Booking = require("../models/booking");
const Package = require("../models/package");

exports.confirmBooking = async (req, res) => {
  try {
    const { packageId, bookingId, paymentId, amount, paymentType } = req.body;
    const userId = req.user.id; 

    // ✅ Check if package exists
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    // ✅ Check if seats are available
    if (packageData.totalSeats <= 0) {
      return res.status(400).json({ success: false, message: "No seats available for this package" });
    }

    // ✅ Reduce seat count
    packageData.totalSeats -= 1;
    await packageData.save();

    // ✅ Create booking entry
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
  