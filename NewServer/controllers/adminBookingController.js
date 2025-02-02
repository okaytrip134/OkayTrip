const json2csv = require("json2csv").parse;
const Booking = require("../models/booking"); // ✅ Import Booking Model

exports.getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const search = req.query.search || "";
        const sort = req.query.sort || "";
        const skip = (page - 1) * limit;

        let query = {};

        // ✅ Search by Booking ID, User Name, Package Title
        if (search) {
            query = {
                $or: [
                    { bookingId: { $regex: search, $options: "i" } },
                    { "userId.name": { $regex: search, $options: "i" } },
                    { "packageId.title": { $regex: search, $options: "i" } }
                ],
            };
        }

        // ✅ Sorting Logic
        let sortQuery = {};
        if (sort === "date") sortQuery = { createdAt: -1 };
        if (sort === "amount") sortQuery = { amount: -1 };
        if (sort === "user") sortQuery = { "userId.name": 1 };

        const totalBookings = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate("packageId userId")
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        res.json({ success: true, bookings, totalPages: Math.ceil(totalBookings / limit) });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

exports.downloadBookingsCSV = async (req, res) => {
  try {
    // Fetch bookings with related user and package details
    const bookings = await Booking.find()
      .populate("userId", "name email phone") // Only include necessary fields
      .populate("packageId", "title duration realPrice discountedPrice startDate endDate");

    // Convert data to CSV format
    const formattedBookings = bookings.map((booking) => ({
      Booking_ID: booking.bookingId,
      Payment_ID: booking.paymentId,
      User_Name: booking.userId?.name || "N/A",
      User_Email: booking.userId?.email || "N/A",
      User_Phone: booking.userId?.phone || "N/A",
      Package_Title: booking.packageId?.title || "N/A",
      Package_Duration: booking.packageId?.duration || "N/A",
      Start_Date: booking.packageId?.startDate ? new Date(booking.packageId.startDate).toLocaleDateString() : "N/A",
      End_Date: booking.packageId?.endDate ? new Date(booking.packageId.endDate).toLocaleDateString() : "N/A",
      Amount_Paid: booking.amount,
      Real_Price: booking.packageId?.realPrice || "N/A",
      Discounted_Price: booking.packageId?.discountedPrice || "N/A",
      Payment_Type: booking.paymentType,
      Status: booking.status,
      Booking_Date: booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A",
    }));

    const csv = json2csv(formattedBookings);

    res.header("Content-Type", "text/csv");
    res.attachment("bookings_report.csv");
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