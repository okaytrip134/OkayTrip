import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiEye } from "react-icons/fi";
import BookingDetailsPopup from "../components/BookingDetailsPopup"; // Import the popup component

const ProfileBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // State for the selected booking

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking); // Open the popup with the selected booking
  };

  const handleClosePopup = () => {
    setSelectedBooking(null); // Close the popup
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">My Bookings</h1>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="animate-pulse bg-white shadow-lg p-6 rounded-lg">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No bookings found.</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* ✅ Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b text-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-bold">Package</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Booking ID</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Payment Type</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Status</th>
                  <th className="text-center py-4 px-6 text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`border-b transition hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    {/* ✅ Package Name */}
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {booking.packageId?.title || "Package Title"}
                    </td>

                    {/* ✅ Booking ID */}
                    <td className="py-4 px-6 text-sm text-gray-500">{booking.bookingId}</td>

                    {/* ✅ Amount */}
                    <td className="py-4 px-6 text-sm font-bold text-green-600">₹{booking.amount}</td>

                    {/* ✅ Payment Type with Icon */}
                    <td className="py-4 px-6 text-sm flex items-center gap-2 text-gray-700">
                      <FiCreditCard className="text-lg" />
                      <span className="capitalize">{booking.paymentType}</span>
                    </td>

                    {/* ✅ Status with Color Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full w-max ${booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "Canceled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {booking.status === "Confirmed" && <FiCheckCircle className="mr-2" />}
                        {booking.status === "Pending" && <FiClock className="mr-2" />}
                        {booking.status === "Canceled" && <FiXCircle className="mr-2" />}
                        {booking.status}
                      </span>
                    </td>

                    {/* ✅ Action Button */}
                    <td className="py-4 px-6 text-center">
                      <button
                        className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <FiEye className="mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Card View */}
          <div className="block md:hidden">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{booking.packageId?.title || "Package Title"}</h2>
                <p className="text-gray-500 text-sm">Booking ID: {booking.bookingId}</p>

                {/* ✅ Amount & Payment Type */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-green-600">₹{booking.amount}</p>
                  <div className="flex items-center gap-1 text-gray-700">
                    <FiCreditCard className="text-lg" />
                    <span className="capitalize">{booking.paymentType}</span>
                  </div>
                </div>

                {/* ✅ Status Badge */}
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "Canceled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* ✅ View Details Button */}
                <button
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition"
                  onClick={() => handleViewDetails(booking)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedBooking && (
        <BookingDetailsPopup booking={selectedBooking} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ProfileBookings;
