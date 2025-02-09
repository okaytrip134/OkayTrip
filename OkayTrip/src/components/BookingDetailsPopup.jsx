import React from "react";
import { FiCreditCard, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const BookingDetailsPopup = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
          <h2 className="text-3xl font-bold">Booking Pass</h2>
          <p className="text-sm opacity-75">Thank you for choosing OkayTrip!</p>
        </div>

        {/* Ticket Content */}
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold">Package Title</h3>
              <p className="text-gray-700">{booking.packageId?.title || "N/A"}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold">Booking ID</h3>
              <p className="text-gray-700">{booking.bookingId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-bold">Amount</h4>
              <p className="text-green-600 font-bold">₹{booking.amount}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold">Payment Type</h4>
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-lg" />
                <span>{booking.paymentType}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold">Status</h4>
              <span
                className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status === "Confirmed" && <FiCheckCircle className="mr-1" />}
                {booking.status === "Pending" && <FiClock className="mr-1" />}
                {booking.status === "Canceled" && <FiXCircle className="mr-1" />}
                {booking.status}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold">Payment Date</h4>
              <p>{new Date(booking.paymentDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="bg-gray-100 p-4 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>

        {/* Decorative Dotted Line */}
        <div className="absolute inset-x-0 top-[65%] border-t-2 border-dotted border-gray-300"></div>
      </div>
    </div>
  );
};

export default BookingDetailsPopup;
