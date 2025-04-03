import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const OfferCouponPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);
  const manuallyClosedRef = useRef(false); // Track if user manually closed the popup
  const navigate = useNavigate();

  // Fetch live offer on component mount
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/current`);

        if (!response.ok) {
          throw new Error("No live offers available");
        }

        const data = await response.json();
        if (data) {
          setOffer(data);
          if (!manuallyClosedRef.current) {
            setShowPopup(true); // Show popup initially only if not manually closed
          }
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching live offer:', error);
      }
    };

    fetchOffer();

    // Set interval to show popup every 10 seconds, but only if not manually closed
    const popupInterval = setInterval(() => {
      if (offer && !manuallyClosedRef.current) {
        setShowPopup(true);
      }
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(popupInterval);
  }, [offer]);

  const handleBookNow = () => {
    setShowPopup(false);
    navigate(`/booking-offer/${offer._id}`);
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    setShowPopup(false);
    manuallyClosedRef.current = true; // Set flag when user manually closes
    
    // Reset the manual close flag after 5 minutes to allow popups to show again
    setTimeout(() => {
      manuallyClosedRef.current = false;
    }, 5 * 60 * 1000);
  };

  if (!offer || (!showPopup && !error)) {
    return null;
  }

  return (
    <>
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">No Live Offers</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-full transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showPopup && offer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={handleClose} // Close when clicking the overlay
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
          >
            <div className="relative">
              {/* Banner Image */}
              <img
                src={`${import.meta.env.VITE_APP_API_URL}${offer.bannerImage}`}
                alt="Special Offer"
                className="w-full object-cover h-64"
              />
              
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition duration-300 shadow-md"
                aria-label="Close popup"
              >
                <X size={24} className="text-gray-800" />
              </button>

              {/* Discount Badge */}
              <div className="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse">
                Special Offer!
              </div>
            </div>

            {/* Offer Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{offer.title}</h2>
              <p className="mb-4 text-gray-600">Limited time offer. Ends on {new Date(offer.endDate).toLocaleDateString()}</p>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-3xl font-bold text-red-600">₹{offer.price}</div>
                <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  Only {offer.totalCoupons} coupons left!
                </div>
              </div>
              
              {/* CTA Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition duration-300"
              >
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
};

export default OfferCouponPopup;