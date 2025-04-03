// src/pages/UserBuyCoupon.jsx
import React, { useState } from 'react';

const UserBuyCoupon = () => {
    const [orderId, setOrderId] = useState(null);

    const handleBuyCoupon = async () => {
        // Trigger backend API to create a Razorpay order
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/coupon/buy-coupon/offerId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentStatus: 'pending' }),
        });

        const data = await response.json();
        if (data.orderId) {
            setOrderId(data.orderId);
            initiateRazorpayPayment(data.orderId);
        }
    };

    const initiateRazorpayPayment = (orderId) => {
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID",
            amount: 1000, // Example amount in paise
            currency: "INR",
            name: "Offer",
            description: "Buy Coupon",
            order_id: orderId,
            handler: function (response) {
                alert("Payment Successful");
                // Verify payment on the backend
                fetch(`${import.meta.env.VITE_APP_API_URL}/api/coupon/buy-coupon/offerId`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentStatus: 'success',
                        paymentId: response.razorpay_payment_id,
                    }),
                }).then(response => response.json()).then(data => {
                    console.log(data);
                });
            },
            prefill: {
                name: "User",
                email: "user@example.com",
            },
            theme: {
                color: "#F37254",
            },
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-8 border border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Buy Coupon for Offer</h2>
                <button
                    onClick={handleBuyCoupon}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                    Buy Coupon
                </button>
            </div>
        </div>
    );
};

export default UserBuyCoupon;
