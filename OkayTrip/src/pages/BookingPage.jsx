import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegCreditCard, FaWallet, FaCheckCircle, FaUsers, FaUser, FaCrown, FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import logo from "../assets/Logo/Trip ok new 2 black-01.png"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0); // initialize to 0, then update after calculation
  // fallback if no coupon
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);


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
    let base = packageData?.discountedPrice || 0;
    let travelerCount = 1;

    if (groupType === "duo") {
      travelerCount = 2;
    } else if (groupType === "squad") {
      travelerCount = numSeats;
    }

    let baseAmount = 0;

    if (selectedPayment === "advance") {
      baseAmount = 1500 * travelerCount; // ✅ FIX: Multiply by traveler count
    } else if (selectedPayment === "partial") {
      baseAmount = base * 0.5 * travelerCount;
    } else if (selectedPayment === "full") {
      baseAmount = base * travelerCount;
    }

    // ✅ Tax logic
    const surcharge = baseAmount * 0.02;
    const gstOnSurcharge = surcharge * 0.18;
    const taxAmount = surcharge + gstOnSurcharge;

    const totalAmount = baseAmount + taxAmount;

    return {
      baseAmount,
      taxAmount,
      totalAmount,
      travelerCount,
    };
  };


  const { baseAmount, taxAmount, totalAmount, travelerCount } = calculatePaymentAmount();
  useEffect(() => {
    setFinalAmount(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    if (totalAmount > 0) {
      const fetchAvailableCoupons = async () => {
        setLoadingCoupons(true);
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/discount/`);
          const filtered = data.filter(c => totalAmount >= c.minOrderAmount);
          setAvailableCoupons(filtered);
        } catch (error) {
          console.error("Failed to fetch available coupons", error);
        } finally {
          setLoadingCoupons(false);
        }
      };

      fetchAvailableCoupons();
    }
  }, [totalAmount]);
  const handleInputChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };
  const handleApplyCoupon = async () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const requestData = {
        code: couponCode.trim().toUpperCase(),
        userId: user?._id,
        totalAmount: totalAmount, // Changed from grandTotal to totalAmount
        packageId: packageId // Added package ID
      };

      console.log("Applying coupon with data:", requestData); // Debug log

      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/discount/apply`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        setDiscountAmount(data.discountAmount);
        setFinalAmount(data.finalAmount);
        setCouponApplied(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to apply coupon");
      }
    } catch (error) {
      console.error("Coupon error details:", {
        status: error.response?.status,
        data: error.response?.data,
        error: error.message
      });

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to apply coupon. Please try again.";
      toast.error(errorMessage);
    }
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-400 mb-4">📦</div>
          <p className="text-xl font-semibold text-red-500">Package not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header Section */}
        {/* Header Section with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-1">

            <div className="flex items-cente">
              <img src={logo} alt="OkayTrip" className="h-20 w-30" />
            </div>
            {/* </div> */}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600 text-lg">Just a few steps away from your dream vacation</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details & Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_APP_API_URL}${packageData.images[0]}`}
                  alt={packageData.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-bold">{packageData.title}</h2>
                  <div className="flex items-center mt-2 text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>Premium Package</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    <span>Flexible Dates</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaClock className="mr-2" />
                    <span>All Inclusive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Group Type Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <FaUsers className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Select Group Type</h3>
                  <p className="text-gray-600">Choose your travel companion preference</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "solo", label: "Solo Traveler", description: "1 person", icon: <FaUser />, color: "blue" },
                  { value: "duo", label: "Duo", description: "2 persons", icon: <FaUsers />, color: "green" },
                  { value: "squad", label: "Squad", description: "3+ persons", icon: <FaCrown />, color: "purple" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${groupType === option.value
                      ? "border-orange-500 bg-orange-50 shadow-lg transform scale-105"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setGroupType(option.value)}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-3 ${groupType === option.value ? 'text-orange-500' : 'text-gray-400'}`}>
                        {option.icon}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    {groupType === option.value && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
                        <FaCheckCircle className="text-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Number of seats input (only shown for Squad) */}
              {groupType === "squad" && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <label className="block text-gray-700 font-semibold mb-3">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={numSeats}
                    onChange={(e) => setNumSeats(Math.max(3, parseInt(e.target.value) || 3))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-2">INFO</span>
                    Minimum 3 travelers required for Squad option
                  </p>
                </div>
              )}
            </div>

            {/* Traveler Details */}
            <div className="bg-white rounded-2xl shadow-lg p-0 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Traveler Details ({travelerCount} {travelerCount === 1 ? "Person" : "Persons"})
                  </h3>
                  <p className="text-gray-600">Please provide accurate information for all travelers</p>
                </div>
              </div>

              <div className="space-y-6">
                {travelers.map((traveler, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <h4 className="font-bold text-gray-800">
                          Traveler {index + 1} {index === 0 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs ml-2">Primary</span>}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input
                            placeholder="Enter full name as per ID"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            value={traveler.name}
                            onChange={(e) => handleInputChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                          <input
                            type="number"
                            placeholder="Age"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            value={traveler.age}
                            onChange={(e) => handleInputChange(index, "age", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                          <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            value={traveler.gender}
                            onChange={(e) => handleInputChange(index, "gender", e.target.value)}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                          <input
                            type="text"
                            placeholder="XXXX-XXXX-XXXX"
                            maxLength={14} // 12 digits + 2 hyphens
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            value={traveler.aadhar}  // ✅ use consistent key
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "").substring(0, 12); // remove non-digits
                              const formatted = raw.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, g1, g2, g3) =>
                                [g1, g2, g3].filter(Boolean).join("-")
                              );
                              const updated = [...travelers];
                              updated[index].aadhar = formatted;
                              setTravelers(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaRegCreditCard className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Choose Payment Method</h3>
                  <p className="text-gray-600">Select your preferred payment option</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { value: "full", label: "Full Payment", subtitle: "Pay complete amount now", icon: <FaCheckCircle />, badge: "Most Popular", badgeColor: "bg-green-500" },
                  { value: "partial", label: "Partial Payment", subtitle: "Pay 50% now, rest later", icon: <FaRegCreditCard />, badge: "Flexible", badgeColor: "bg-blue-500" },
                  { value: "advance", label: "Advance Payment", subtitle: "Pay ₹1500 now, rest later", icon: <FaWallet />, badge: "Budget Friendly", badgeColor: "bg-purple-500" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${selectedPayment === option.value
                      ? "border-orange-500 bg-orange-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    onClick={() => setSelectedPayment(option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`text-2xl ${selectedPayment === option.value ? 'text-orange-500' : 'text-gray-400'}`}>
                          {option.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{option.label}</h4>
                          <p className="text-gray-600 text-sm">{option.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`${option.badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium mr-3`}>
                          {option.badge}
                        </span>
                        {selectedPayment === option.value && (
                          <div className="bg-orange-500 text-white rounded-full p-1">
                            <FaCheckCircle className="text-sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Refund Policy (Kept Same) */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
              <div className="mt-6 flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <input
                  type="checkbox"
                  id="agreeToPolicy"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                <label htmlFor="agreeToPolicy" className="text-gray-800 text-sm font-medium leading-relaxed">
                  I have read and agree to the Refund Policy and Terms & Conditions.
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Booking Summary</h3>

                {/* Package Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">{packageData.title}</h4>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Travelers:</span>
                    <span>{travelerCount} {travelerCount === 1 ? "person" : "persons"}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Group Type:</span>
                    <span className="capitalize">{groupType}</span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Base Amount</span>
                    <span className="font-semibold">₹{baseAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
                  </div>

                  {/* Available Coupons Section */}
                  {loadingCoupons ? (
                    <div className="text-center py-4">Loading coupons...</div>
                  ) : availableCoupons.length > 0 ? (
                    <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Coupons</h4>
                      <div className="flex flex-wrap gap-3">
                        {availableCoupons.map((coupon) => {
                          const isEligible = totalAmount >= coupon.minOrderAmount;
                          return (
                            <div
                              key={coupon._id}
                              title={isEligible ? `Get ${coupon.discountType === 'flat' ? `₹${coupon.discountValue}` : `${coupon.discountValue}% off`}` : `Minimum order ₹${coupon.minOrderAmount}`}
                              className={`px-3 py-2 rounded-md text-sm font-medium border transition-all ${isEligible
                                ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 cursor-pointer'
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                }`}
                              onClick={() => {
                                if (isEligible && !couponApplied) {
                                  setCouponCode(coupon.code);
                                }
                              }}
                            >
                              {coupon.code}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No coupons available</div>
                  )}


                  <div className="flex justify-between items-center py-3 bg-orange-50 rounded-lg px-4 border-2 border-orange-200">
                    <span className="text-lg font-bold text-gray-800">Total Payable</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{couponApplied ? finalAmount.toFixed(2) : totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-gray-800 mb-2">Payment Method</h5>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedPayment === "full" && "Full Payment - Pay complete amount now"}
                    {selectedPayment === "partial" && "Partial Payment - Pay 50% now"}
                    {selectedPayment === "advance" && "Advance Payment - Pay ₹1500 now"}
                  </p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Have a Coupon?
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="border px-3 py-2 rounded w-full"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                    >
                      {couponApplied ? "Applied" : "Apply"}
                    </button>
                  </div>

                  {couponApplied && (
                    <p className="text-green-600 text-sm mt-2">
                      Coupon applied successfully! You saved ₹{discountAmount}
                    </p>
                  )}
                </div>


                {/* Proceed Button */}
                <button
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${agreedToPolicy
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                  onClick={handleProceedToPayment}
                  disabled={!agreedToPolicy}
                >
                  {agreedToPolicy ? "Proceed to Payment" : "Accept Policy to Continue"}
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">Secure Payment</p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">🔒 SSL Secured</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">💳 PCI Compliant</span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                <p className="text-sm mb-4 opacity-90">Our travel experts are here to assist you</p>
                <div className="space-y-2 text-sm">
                  {/* <div className="flex items-center">
                      <span className="mr-2">📞</span>
                      <span>Call: +91 1234567890</span>
                    </div> */}
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>Email: support@okaytrip.in</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">💬</span>
                    <span>Live Chat Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Secure Booking</h4>
              <p className="text-sm text-gray-600">Your data is protected with bank-level security</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Best Price</h4>
              <p className="text-sm text-gray-600">Guaranteed lowest prices with no hidden fees</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Expert Support</h4>
              <p className="text-sm text-gray-600">24/7 customer support for your travel needs</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Quality Assured</h4>
              <p className="text-sm text-gray-600">Handpicked experiences for memorable trips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;