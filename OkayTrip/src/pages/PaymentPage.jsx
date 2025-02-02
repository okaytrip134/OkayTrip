import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify Styles
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaLock } from "react-icons/fa";
import logo from "../assets/Logo/Trip ok new 2 black-01.png"; // ✅ Import company logo

const PaymentPage = () => {
  const API_URL = "http://localhost:8000";
  const location = useLocation();
  const navigate = useNavigate();
  const { packageId, packageTitle, amount, paymentType } = location.state || {};
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId || !amount) {
      navigate("/"); // Redirect if data is missing
      return;
    }

    // ✅ Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          setIsScriptLoaded(true);
          setLoading(false);
          resolve(true);
        };
        script.onerror = () => {
          setIsScriptLoaded(false);
          setLoading(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsScriptLoaded(true);
      setLoading(false);
    }
  }, [packageId, amount, navigate]);

  const handlePayment = async () => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      toast.error("Please log in to proceed with payment."); // ✅ Show Toast Notification
      return;
    }

    toast.info("Processing Payment..."); // ✅ Show Toast Notification

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/payment/payment`,
        { packageId, packageTitle, amount, paymentType },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "OkayTrip",
        description: `Booking for ${packageTitle}`,
        image: logo, // ✅ Use company logo for branding
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_APP_API_URL}/api/bookings/confirm`,
              {
                packageId,
                bookingId: data.bookingId,
                paymentId: response.razorpay_payment_id,
                amount,
                paymentType,
              },
              {
                headers: { Authorization: `Bearer ${userToken}` },
              }
            );

            toast.success("Payment Successful! Redirecting..."); // ✅ Success Toast

            setTimeout(() => {
              navigate(`/package/${packageId}`); // ✅ Redirect back to package details page
            }, 3000);
          } catch (error) {
            console.error("Error confirming booking:", error);
            toast.error("Error confirming booking. Please contact support."); // ✅ Error Toast
          }
        },
        prefill: {
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("userEmail"),
          contact: localStorage.getItem("userPhone"),
        },
        theme: {
          color: "#F37002",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Payment failed. Please try again."); // ✅ Failure Toast
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* ✅ Include Toastify container for notifications */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-gray-200">
        
        {/* ✅ Company Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Company Logo" className="h-12" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h1>
        <p className="text-gray-500 text-sm mb-4 flex items-center justify-center">
          <FaLock className="text-green-500 mr-2" /> Your payment is 100% safe and secure
        </p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700 text-lg mb-1">
            <span className="font-semibold text-gray-900">Package:</span> {packageTitle}
          </p>
          <p className="text-gray-700 text-lg mb-1">
            <span className="font-semibold text-gray-900">Amount:</span> ₹{amount.toFixed(2)}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-gray-900">Payment Type:</span> {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
          </p>
        </div>

        {/* ✅ Payment Button */}
        <button
          className={`mt-6 w-full py-3 rounded-lg text-white font-semibold text-lg transition-all ${
            isScriptLoaded ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"
          }`}
          onClick={handlePayment}
          disabled={!isScriptLoaded}
        >
          {isScriptLoaded ? "Proceed to Pay" : "Loading Payment Gateway..."}
        </button>

        {/* ✅ Trust & Security */}
        <p className="text-gray-400 text-sm mt-4">
          <FaLock className="inline-block mr-1" /> Transactions are encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
