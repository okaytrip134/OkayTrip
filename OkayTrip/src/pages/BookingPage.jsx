import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegCreditCard, FaWallet, FaCheckCircle } from "react-icons/fa";

const BookingPage = () => {
  // const API_URL = "http://localhost:8000";
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("full"); // Default Full Payment
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (!userToken) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    const fetchPackage = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/details/${packageId}`
        );
        setPackageData(data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId, userToken, navigate]);

  const calculatePaymentAmount = () => {
    if (selectedPayment === "partial") return packageData.discountedPrice * 0.5;
    if (selectedPayment === "advance") return packageData.discountedPrice * 0.2;
    return packageData.discountedPrice;
  };

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        packageId: packageData._id,
        packageTitle: packageData.title,
        amount: calculatePaymentAmount(),
        paymentType: selectedPayment,
      },
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading package details...</div>;
  }

  if (!packageData) {
    return <div className="text-center py-10 text-lg text-red-500">Package not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Package Details */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={`${import.meta.env.VITE_APP_API_URL}${packageData.images[0]}`}
          alt={packageData.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{packageData.title}</h1>
          <p className="text-gray-600 mt-2">{packageData.description}</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Payment Option Cards */}
          {[
            { value: "partial", label: "Partial Payment (50%)", amount: packageData.discountedPrice * 0.5, icon: <FaRegCreditCard /> },
            { value: "advance", label: "Advance Payment (20%)", amount: packageData.discountedPrice * 0.2, icon: <FaWallet /> },
            { value: "full", label: "Full Payment", amount: packageData.discountedPrice, icon: <FaCheckCircle /> },
          ].map((option) => (
            <div
              key={option.value}
              className={`border-2 rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                selectedPayment === option.value ? "border-orange-500 bg-orange-100" : "border-gray-300"
              }`}
              onClick={() => setSelectedPayment(option.value)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-orange-500">{option.icon}</span>
                <span className="text-gray-800 font-semibold">{option.label}</span>
              </div>
              <span className="text-gray-700 font-bold text-lg">₹{option.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Amount & Proceed Button */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Total Payable:</h3>
          <p className="text-2xl font-bold text-orange-500 mt-1">₹{calculatePaymentAmount().toFixed(2)}</p>
        </div>
        <button
          className="mt-4 md:mt-0 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
