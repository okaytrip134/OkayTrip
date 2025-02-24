import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify Styles
import logo from "../assets/Logo/Trip ok new 2 black-01.png"; // ✅ Import company logo
import { FaLock } from "react-icons/fa";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Destructure state safely and provide fallback values
  const {
    packageId = null,
    packageTitle = "Unknown Package",
    amount = 0,
    paymentType = "online",
  } = location.state || {};

  const safeAmount = parseFloat(amount) || 0; // ✅ Ensure amount is a valid number

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("PaymentPage state:", location.state); // ✅ Debugging log

    if (!packageId || safeAmount <= 0) {
      toast.error("Invalid payment details. Redirecting...");
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
  }, [packageId, safeAmount, navigate]);

  const handlePayment = async () => {
    const userToken = localStorage.getItem("userToken");
  
    if (!userToken) {
      toast.error("Please log in to proceed with payment.");
      return;
    }
  
    toast.info("Processing Payment...");
  
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/payment/payment`,
        { packageId, packageTitle, amount: safeAmount, paymentType },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "OkayTrip",
        description: `Booking for ${packageTitle}`,
        image: logo,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_APP_API_URL}/api/bookings/confirm`,
              {
                packageId,
                bookingId: data.bookingId,
                paymentId: response.razorpay_payment_id,
                amount: safeAmount,
                paymentType,
                seatsToBook: location.state.numSeats, // ✅ Save number of seats
                travelers: location.state.travelers, // ✅ Save traveler details
              },
              {
                headers: { Authorization: `Bearer ${userToken}` },
              }
            );
  
            toast.success("Payment Successful! Redirecting...");
            setTimeout(() => {
              navigate(`/package/${packageId}`);
            }, 3000);
          } catch (error) {
            console.error("Error confirming booking:", error);
            toast.error("Error confirming booking. Please contact support.");
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
      toast.error("Payment failed. Please try again.");
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-8 min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-gray-200">

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
            <span className="font-semibold text-gray-900">Amount:</span> ₹{safeAmount.toFixed(2)}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-gray-900">Payment Type:</span> {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
          </p>
        </div>

        <button
          className={`mt-6 w-full py-3 rounded-lg text-white font-semibold text-lg transition-all ${isScriptLoaded ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"
            }`}
          onClick={handlePayment}
          disabled={!isScriptLoaded}
        >
          {isScriptLoaded ? "Proceed to Pay" : "Loading Payment Gateway..."}
        </button>

        <p className="text-gray-400 text-sm mt-4">
          <FaLock className="inline-block mr-1" /> Transactions are encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
