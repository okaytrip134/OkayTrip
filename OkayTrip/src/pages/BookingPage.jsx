import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegCreditCard, FaWallet, FaCheckCircle } from "react-icons/fa";

const BookingPage = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("full");
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [groupType, setGroupType] = useState("solo"); // 'solo', 'duo', or 'squad'
  const [numSeats, setNumSeats] = useState(1); // Only used when groupType is 'squad'
  const [travelers, setTravelers] = useState([]);

  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (!userToken) {
      navigate("/");
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

  // Initialize traveler details based on group type
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    let travelerCount = 1;
    
    if (groupType === "duo") {
      travelerCount = 2;
    } else if (groupType === "squad") {
      travelerCount = numSeats;
    }

    setTravelers((prev) => {
      const updatedTravelers = [...prev];

      // Ensure traveler form always matches the required number
      while (updatedTravelers.length < travelerCount) {
        updatedTravelers.push({ name: "", age: "", gender: "", aadhar: "" });
      }
      while (updatedTravelers.length > travelerCount) {
        updatedTravelers.pop();
      }

      // If first traveler & user exists, pre-fill user details
      if (travelerCount >= 1 && user) {
        updatedTravelers[0] = {
          name: user.name || "",
          age: user.age || "",
          gender: user.gender || "",
          aadhar: user.aadhar || "",
        };
      }

      return updatedTravelers;
    });
  }, [groupType, numSeats]);

  const calculatePaymentAmount = () => {
    let baseAmount = packageData?.discountedPrice || 0;
    let tax = 0;
    let travelerCount = 1;

    if (groupType === "duo") {
      travelerCount = 2;
    } else if (groupType === "squad") {
      travelerCount = numSeats;
    }

    if (selectedPayment === "partial") {
      baseAmount *= 0.5;
    } else if (selectedPayment === "advance") {
      baseAmount *= 0.2;
    } else if (selectedPayment === "full") {
      tax = baseAmount * 0.18; // Apply 18% GST for full payment
    }

    return {
      baseAmount: baseAmount * travelerCount,
      taxAmount: tax * travelerCount,
      totalAmount: (baseAmount + tax) * travelerCount,
      travelerCount,
    };
  };

  const { baseAmount, taxAmount, totalAmount, travelerCount } = calculatePaymentAmount();

  const handleInputChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const handleProceedToPayment = () => {
    if (!agreedToPolicy) {
      alert("Please agree to the refund policy before proceeding.");
      return;
    }

    if (travelers.some((t) => !t.name || !t.age || !t.gender || !t.aadhar)) {
      alert("Please fill all traveler details.");
      return;
    }

    localStorage.setItem("travelers", JSON.stringify(travelers));
    localStorage.setItem("numSeats", travelerCount);

    navigate("/payment", {
      state: {
        packageId: packageData._id,
        packageTitle: packageData.title,
        amount: totalAmount,
        paymentType: selectedPayment,
        travelers,
        numSeats: travelerCount,
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

      {/* Group Type Selection */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800">Select Group Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { value: "solo", label: "Solo Traveler", description: "1 person" },
            { value: "duo", label: "Duo", description: "2 persons" },
            { value: "squad", label: "Squad", description: "3+ persons" },
          ].map((option) => (
            <div
              key={option.value}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                groupType === option.value
                  ? "border-orange-500 bg-orange-100"
                  : "border-gray-300"
              }`}
              onClick={() => setGroupType(option.value)}
            >
              <h4 className="font-semibold text-gray-800">{option.label}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          ))}
        </div>

        {/* Number of seats input (only shown for Squad) */}
        {groupType === "squad" && (
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              Number of Travelers
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={numSeats}
              onChange={(e) => setNumSeats(Math.max(3, parseInt(e.target.value) || 3))}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum 3 travelers required for Squad option
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Traveler Details ({travelerCount} {travelerCount === 1 ? "Person" : "Persons"})
        </h3>
        {travelers.map((traveler, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <h4 className="font-semibold text-gray-700">
              Traveler {index + 1} {index === 0 && "(Primary)"}
            </h4>
            <input
              placeholder="Full Name"
              className="w-full my-2 p-2 border rounded-md"
              value={traveler.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full my-2 p-2 border rounded-md"
              value={traveler.age}
              onChange={(e) => handleInputChange(index, "age", e.target.value)}
            />
            <select
              className="w-full my-2 p-2 border rounded-md"
              value={traveler.gender}
              onChange={(e) => handleInputChange(index, "gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              placeholder="Aadhar Number"
              className="w-full my-2 p-2 border rounded-md"
              value={traveler.aadhar}
              onChange={(e) => handleInputChange(index, "aadhar", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Payment Options */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: "partial", label: "Partial Payment (50%)", icon: <FaRegCreditCard /> },
            { value: "advance", label: "Advance Payment (20%)", icon: <FaWallet /> },
            { value: "full", label: "Full Payment (100%) + 18% GST", icon: <FaCheckCircle /> },
          ].map((option) => (
            <div
              key={option.value}
              className={`border-2 rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                selectedPayment === option.value
                  ? "border-orange-500 bg-orange-100"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPayment(option.value)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-orange-500">{option.icon}</span>
                <span className="text-gray-800 font-semibold">{option.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Payment */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800">Total Payment</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700 text-lg mb-1">
            <span className="font-semibold text-gray-900">Base Amount:</span> ₹
            {baseAmount.toFixed(2)} ({travelerCount} {travelerCount === 1 ? "person" : "persons"})
          </p>
          {selectedPayment !== "full" && (
            <p className="text-red-600 text-sm font-medium">
              Tax will be included after full payment.
            </p>
          )}
          {selectedPayment === "full" && (
            <p className="text-gray-700 text-lg mb-1">
              <span className="font-semibold text-gray-900">GST (18%):</span> ₹
              {taxAmount.toFixed(2)}
            </p>
          )}
          <p className="text-xl font-bold text-orange-500 mt-1">
            <span className="font-semibold">Total Payable:</span> ₹{totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ✅ Refund Policy (Kept Same) */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowRefundPolicy(!showRefundPolicy)}
        >
          <h3 className="text-lg font-semibold text-gray-800">Refund Policy</h3>
          <span className="text-orange-500 font-bold">
            {showRefundPolicy ? "▲" : "▼"}
          </span>
        </div>
        {showRefundPolicy && (
          <div className="mt-4 text-gray-700 text-sm bg-gray-50 p-4 rounded-lg border border-gray-300">
            <p><strong>Eligibility for Refunds:</strong></p>
            <h3>Customers may be eligible for a refund in the following circumstances:</h3>
            <ul className="list-disc pl-5">
              <li><strong>Cancellation by the Travel Agency: </strong>If the travel agency cancels a trip for any reason, customers will receive a full refund of the total trip cost, including any additional services booked Tours.</li>
              <li><strong>Significant Changes to Itinerary or Accommodations:</strong> If there are significant changes to the original itinerary or accommodations, such as a change in the destination, dates, or quality of the accommodation, customers will have the option to either accept the new arrangements or request a refund.</li>
              <li><strong>Medical Emergencies or Personal Reasons: </strong>If a customer needs to cancel due to a medical emergency or other personal reasons, they may be eligible for a partial refund, subject to the terms listed below. Documentation (e.g., medical certificates) will be required for verification.</li>
            </ul>

            <p className="mt-2"><strong>Refund Timelines:</strong></p>
            <h3>Refund requests must be submitted within the following timeframes for consideration:</h3>
            <ul className="list-disc pl-5">
              <li><strong>Full Refund:</strong> Cancellations made 30 or more days prior to the trip's scheduled departure date will be eligible for a full refund.</li>
              <li><strong>Partial Refund:</strong> Cancellations made between 15 and 29 days prior to the trip will be eligible for a partial refund. The refund amount will vary based on the specific trip and services booked.</li>
              <li><strong>No Refund:</strong>  Cancellations made within 14 days of the scheduled trip departure date will not be eligible for any refund.</li>
              <li><strong>Processing Time:</strong>  Refund requests will be processed within 10-15 business days once all required documentation has been submitted and approved.</li>
            </ul>

            <p className="mt-2"><strong>Refund Amount:</strong></p>
            <h3>The refund amount will depend on when the cancellation request is made and the specifics of the booking:</h3>
            <ul className="list-disc pl-5">
              <li><strong>Full Refund:</strong> A full refund will be issued if the cancellation is made 30 or more days before the scheduled departure date, minus any non-refundable fees (see below for exclusions).</li>
              <li><strong>Partial Refund: </strong>Cancellations made 15 to 29 days prior to departure will receive a partial refund. This will generally be 50% to 75% of the total trip cost, depending on the services involved (e.g., flights, accommodations, tours).</li>
              <li><strong>No Refund: </strong>Cancellations made within 14 days of the trip will not be eligible for a refund.
                Refunds will be issued via the same payment method used for the original booking, unless otherwise specified. Any applicable currency conversion or banking fees may apply.
              </li>
            </ul>

            <p className="mt-2"><strong>Exclusions and Limitations</strong></p>
            <h3>Please note the following exclusions and limitations:</h3>
            <ul className="list-disc pl-5">
              <li><strong>Non-Refundable Fees:</strong> Certain fees such as booking fees, service charges, and administrative fees are non-refundable. These fees are clearly specified at the time of booking.</li>
              <li><strong>Non-Refundable Components:</strong> Certain trip components such as flights, pre-paid accommodations, and activities may not be refundable due to restrictions imposed by the service providers (e.g., airlines, hotels). In these cases, customers may be eligible for a credit or voucher, but not a cash refund.</li>
              <li><strong>Group Bookings & Package Deals:</strong>Group Bookings & Package Deals: For group bookings or package deals, specific refund terms may apply based on the agreement made at the time of booking. These terms may differ from individual booking policies and are subject to the terms of the vendors involved.</li>
            </ul>

            <p className="mt-2"><strong>Refund Process: </strong></p>
            <h3>To request a refund, customers must follow these steps:</h3>
            <ul className="list-disc pl-5"
              style={{
                TextDecoder: 'none',
                listStyle: 'none'
              }}
            >
              <li>1. <strong>	Submit a Refund Request:</strong> Complete the refund request form available on our website or email our customer service team at <a href="mailto:support@okaytrip.in" className="font-bold"> support@okaytrip.in</a>. Include your booking reference number, trip details, and reason for cancellation.</li>
              <li>2.	<strong>Provide Required Documentation: </strong>Depending on the reason for the cancellation, you may be required to submit supporting documents, such as:
                <ul className="list-disc pl-5">
                  <li>Proof of cancellation (e.g., flight cancellation notice)</li>
                  <li>Medical documentation (e.g., doctor's note or hospital records) for medical-related cancellations.</li>
                  <li>Any other relevant supporting documents as requested.</li>
                </ul>
              </li>
              <li>
                3.   <strong>Review & Approval: </strong>Once your refund request and documentation are received, our team will review your case and determine the eligibility for a refund. We will notify you of our decision within 5 business days.
              </li>
              <li>
                4.	<strong>Refund Issuance:</strong> If approved, your refund will be processed within 10-15 business days. Refunds will be issued to the original method of payment unless otherwise specified. Please note that additional processing times may apply, depending on your payment provider.
              </li>

            </ul>
            <p className="mt-4 text-gray-600 text-xs">
              If you have any questions or concerns regarding your refund request, feel free to contact us at <a href="mailto:support@okaytrip.in">support@okaytrip.in</a>
            </p>
          </div>
        )}

        {/* Checkbox for Agreement */}
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="agreeToPolicy"
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
            className="w-5 h-5 text-orange-500 border border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="agreeToPolicy" className="ml-2 text-gray-800 text-sm">
            I have read and agree to the Refund Policy.
          </label>
        </div>
      </div>

      {/* Proceed to Payment */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Total Payable:</h3>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            ₹{totalAmount.toFixed(2)}
          </p>
        </div>
        <button
          className={`mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-semibold text-lg ${
            agreedToPolicy ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleProceedToPayment}
          disabled={!agreedToPolicy}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookingPage;