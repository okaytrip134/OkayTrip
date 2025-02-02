import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiCheckCircle, FiXCircle, FiClock, FiCreditCard } from "react-icons/fi";

const ProfileBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 p-6 rounded-lg shadow-md">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No bookings found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform transform hover:scale-105 duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900">{booking.packageId?.title || "Package Title"}</h2>
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
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                    booking.status === "Confirmed"
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
              </div>

              {/* ✅ View Details Button */}
              <button
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition"
                onClick={() => (window.location.href = `/package/${booking.packageId?._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBookings;
