// src/pages/BookCoupon.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookCoupon = () => {
  const [offer, setOffer] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

// Then use this same token variable everywhere

  useEffect(() => {
    // Fetch live offer details passed from previous page
    const fetchOffer = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/current`);
        const data = await response.json();
        if (data) {
          setOffer(data);  // Set the offer data from the backend
        }
      } catch (error) {
        console.error('Error fetching offer details:', error);
      }
    };

    fetchOffer();
  }, []);
  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Razorpay Payment
  const handlePayment = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
  
    if (!offer) return;
  
    if (!window.Razorpay) {
      console.error('Razorpay not loaded yet');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/coupon/buy-coupon/${offer._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: "pending" })
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      const data = await response.json();
  
      if (data.orderId) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: offer.price * 100,
          currency: "INR",
          name: "Coupon Offer",
          description: "Book Your Coupon",
          order_id: data.orderId,
          handler: async function (response) {
            setPaymentStatus("Payment Successful");
            await confirmPayment(response.razorpay_payment_id);
          },
          prefill: {
            name: "User",
            email: "user@example.com",
          },
          theme: {
            color: "#F37254",
          },
        };
  
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("Payment failed: " + error.message);
    }
  };
  // Confirm the payment with backend after payment completion
  const confirmPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/coupon/buy-coupon/${offer._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentStatus: "success",
            paymentId: paymentId // Ensure this matches backend expectation
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment confirmation failed');
      }
  
      const data = await response.json();
      if (data.coupon) {
        setPaymentStatus("Coupon purchased successfully!");
        // Optional: redirect to coupons page or show success modal
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setPaymentStatus(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      {offer ? (
        <div className="p-8 border border-gray-300 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-bold mb-4">{offer.title}</h2>
          <img
            src={`${import.meta.env.VITE_APP_API_URL}${offer.bannerImage}`} // Fixed the image URL path
            alt="Offer Banner"
            className="w-full mb-4"
            style={{ maxHeight: "200px", objectFit: "cover" }}
          />
          <div className="mb-4">
            <p><strong>Price: </strong>₹{offer.price}</p>
            <p><strong>Offer Ends: </strong>{new Date(offer.endDate).toLocaleString()}</p>
          </div>
          <button
          onClick={handlePayment}
          className={`bg-blue-500 text-white py-2 px-4 rounded-md w-full ${
            !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!razorpayLoaded}
        >
          {razorpayLoaded ? 'Proceed with Payment' : 'Loading Payment...'}
        </button>
          {paymentStatus && <p className="mt-4 text-center">{paymentStatus}</p>}
        </div>
      ) : (
        <p>Loading Offer...</p>
      )}
    </div>
  );
};

export default BookCoupon;
