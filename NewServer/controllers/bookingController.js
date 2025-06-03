const Booking = require("../models/booking");
const Package = require("../models/package");
const Counter = require("../models/counter");

const getNextBookingNumber = async () => {
  const result = await Counter.findOneAndUpdate(
    { name: "bookingId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `OKB${String(result.value).padStart(6, "0")}`;
};

exports.confirmBooking = async (req, res) => {
  try {
    const { packageId, paymentId, amount, paymentType, seatsToBook, travelers } = req.body;
    const userId = req.user.id;

    if (!seatsToBook || seatsToBook <= 0) {
      return res.status(400).json({ message: "Invalid number of seats to book." });
    }

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    if (packageData.availableSeats < seatsToBook) {
      return res.status(400).json({ message: "Not enough available seats." });
    }

    if (seatsToBook > 1 && (!travelers || travelers.length !== seatsToBook)) {
      return res.status(400).json({ message: "All traveler details must be provided." });
    }

    // ✅ Generate bookingId here (IMPORTANT)
    const bookingId = await getNextBookingNumber();

    packageData.availableSeats -= seatsToBook;
    await packageData.save();

    const newBooking = new Booking({
      userId,
      packageId,
      bookingId,
      paymentId,
      amount,
      paymentType,
      seatsBooked: seatsToBook,
      travelers,
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
