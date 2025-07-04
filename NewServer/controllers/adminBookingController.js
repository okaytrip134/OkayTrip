const json2csv = require("json2csv").parse;
const Booking = require("../models/booking");

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    // Build query based on filters
    let query = {};

    // Search filter
    if (req.query.search) {
      query.$or = [
        { bookingId: { $regex: req.query.search, $options: "i" } },
        { "userId.name": { $regex: req.query.search, $options: "i" } },
        { "packageId.title": { $regex: req.query.search, $options: "i" } }
      ];
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Payment type filter
    if (req.query.paymentType) {
      query.paymentType = req.query.paymentType;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.amount = {};
      if (req.query.minPrice) query.amount.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.amount.$lte = parseFloat(req.query.maxPrice);
    }

    // Always sort by createdAt in descending order
    const sortQuery = { createdAt: -1 };

    const totalBookings = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate("packageId userId")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.json({ 
      success: true, 
      bookings, 
      totalPages: Math.ceil(totalBookings / limit) 
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

exports.downloadBookingsCSV = async (req, res) => {
  try {
    // Build query based on filters (same as getAllBookings)
    let query = {};

    if (req.query.search) {
      query.$or = [
        { bookingId: { $regex: req.query.search, $options: "i" } },
        { "userId.name": { $regex: req.query.search, $options: "i" } },
        { "packageId.title": { $regex: req.query.search, $options: "i" } }
      ];
    }

    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.paymentType) {
      query.paymentType = req.query.paymentType;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.amount = {};
      if (req.query.minPrice) query.amount.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.amount.$lte = parseFloat(req.query.maxPrice);
    }

    const bookings = await Booking.find(query)
      .populate("userId", "name email phone")
      .populate("packageId", "title duration realPrice discountedPrice startDate endDate")
      .lean();

    const formattedBookings = bookings.map((booking) => {
      const travelerDetails = booking.travelers && booking.travelers.length > 0
        ? booking.travelers.map(traveler => 
          `${traveler.name} (Age: ${traveler.age}, Gender: ${traveler.gender}, Aadhar: ${traveler.aadhar})`
        ).join(" | ")
        : "N/A";

      return {
        Booking_ID: booking.bookingId,
        Payment_ID: booking.paymentId,
        User_Name: booking.userId?.name || "N/A",
        User_Email: booking.userId?.email || "N/A",
        User_Phone: booking.userId?.phone || "N/A",
        Package_Title: booking.packageId?.title || "N/A",
        Package_Duration: booking.packageId?.duration || "N/A",
        Start_Date: booking.packageId?.startDate ? new Date(booking.packageId.startDate).toLocaleDateString() : "N/A",
        End_Date: booking.packageId?.endDate ? new Date(booking.packageId.endDate).toLocaleDateString() : "N/A",
        Seats_Booked: booking.seatsBooked || 1,
        Travelers: travelerDetails,
        Amount_Paid: booking.amount,
        Real_Price: booking.packageId?.realPrice || "N/A",
        Discounted_Price: booking.packageId?.discountedPrice || "N/A",
        Payment_Type: booking.paymentType,
        Status: booking.status,
        Booking_Date: booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A",
      };
    });

    const csv = json2csv(formattedBookings);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_bookings_report.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ success: false, message: "Failed to generate CSV" });
  }
};
// ✅ Update Booking Status
exports.updateBookingStatus = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;
  
      // Allowed status values
      const allowedStatuses = ["Pending", "Confirmed", "Canceled", "Completed"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }
  
      const booking = await Booking.findOneAndUpdate(
        { bookingId },
        { status },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
      res.json({ success: true, message: "Booking status updated successfully", booking });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ success: false, message: "Failed to update booking status" });
    }
  };
  
  // ✅ Cancel Booking
  exports.cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      const booking = await Booking.findOneAndUpdate(
        { bookingId },
        { status: "Canceled" },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
      res.json({ success: true, message: "Booking canceled successfully", booking });
    } catch (error) {
      console.error("Error canceling booking:", error);
      res.status(500).json({ success: false, message: "Failed to cancel booking" });
    }
  };
  exports.deleteBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      // Check if booking exists
      const booking = await Booking.findOne({ bookingId });
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
      // Delete the booking
      await Booking.deleteOne({ bookingId });
  
      res.json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ success: false, message: "Failed to delete booking" });
    }
  };
  