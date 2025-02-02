import React from "react";
import axios from "axios";

const BookingTable = ({ bookings }) => {
  const handleDownloadReport = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/bookings/download", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "booking_report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading booking report:", error);
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={handleDownloadReport}
      >
        Download Report (CSV)
      </button>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">Booking ID</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Package</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Payment Type</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="border-b">
              <td className="py-2 px-4">{booking.bookingId}</td>
              <td className="py-2 px-4">{booking.userId?.name || "Unknown User"}</td>
              <td className="py-2 px-4">{booking.packageId?.title || "Unknown Package"}</td>
              <td className="py-2 px-4">₹{booking.amount}</td>
              <td className="py-2 px-4">{booking.paymentType.toUpperCase()}</td>
              <td className="py-2 px-4">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
