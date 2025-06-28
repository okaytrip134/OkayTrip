import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPrint, FaHome } from "react-icons/fa";
import logo from "../assets/Logo/Trip ok new 2 black-01.png";
import { motion } from "framer-motion";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const { bookingId, paymentId, packageTitle, amount } = location.state || {};

  useEffect(() => {
    if (!bookingId || !paymentId || !packageTitle || !amount) {
      navigate("/");
    }
  }, [bookingId, paymentId, packageTitle, amount, navigate]);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-gray-200"
      >
        {/* ✅ Static Icon Only */}
        {/* <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" /> */}
        <img src="/checklist.png" alt="booking success" className="w-14 h-14 mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your payment. Your booking has been confirmed.</p>

        {/* ✅ Invoice Section */}
        <div ref={invoiceRef} className="bg-gray-100 p-6 rounded-lg text-left shadow-md invoice">
          <div className="flex justify-between items-center mb-4">
            <img src={logo} alt="Company Logo" className="h-12" />
            <p className="text-sm text-gray-500">Invoice # {bookingId}</p>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">{packageTitle}</h2>
          <p className="text-gray-700"><strong>Booking ID:</strong> {bookingId}</p>
          <p className="text-gray-700"><strong>Payment ID:</strong> {paymentId}</p>
          <p className="text-gray-700"><strong>Amount Paid:</strong> ₹{amount.toFixed(2)}</p>

          <hr className="my-4 border-gray-300" />

          <div className="text-sm text-gray-600">
            <p><strong>Thank you for choosing OkayTrip!</strong></p>
            <p>For any assistance, contact <a href="mailto:support@okaytrip.in" className="text-blue-500">support@okaytrip.in</a></p>
          </div>
        </div>

        {/* ✅ Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-6 no-print">
          <button
            onClick={handlePrintInvoice}
            className="w-full md:w-auto py-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold flex justify-center items-center gap-2"
          >
            <FaPrint /> Print Invoice
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full md:w-auto py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold flex justify-center items-center gap-2"
          >
            <FaHome /> Go to Home
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-4 no-print">
          You can download and print this invoice for your records.
        </p>
      </motion.div>

      {/* ✅ CSS for Printing */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .invoice, .invoice * {
              visibility: visible;
            }
            .invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
              box-shadow: none;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BookingSuccess;
