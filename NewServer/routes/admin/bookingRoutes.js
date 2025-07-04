const express = require("express");
const { 
  getAllBookings, 
  updateBookingStatus, 
  cancelBooking, 
  downloadBookingsCSV,
  deleteBooking
} = require("../../controllers/adminBookingController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// ✅ Get all bookings
router.get("/", authMiddleware, getAllBookings);

// ✅ Download bookings as CSV
router.get("/download", authMiddleware, downloadBookingsCSV);

// ✅ Update booking status (Pending, Confirmed, Canceled, Completed)
router.put("/:bookingId/status", authMiddleware, updateBookingStatus);

// ✅ Cancel a booking
router.put("/:bookingId/cancel", authMiddleware, cancelBooking);
router.delete("/:bookingId/delete", deleteBooking); // DELETE request

module.exports = router;
