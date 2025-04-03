import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLoader, FiCheckCircle, FiClock, FiCreditCard, FiEye, FiTag, FiAward, FiXCircle } from "react-icons/fi";

const UserCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserCoupons = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/coupon/view-coupons`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your coupons');
        }

        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCoupons();
  }, [token]);

  const handleViewDetails = (couponId) => {
    if (!couponId) {
      console.error("No coupon ID provided");
      return;
    }
    navigate(`/coupon/${couponId}`);
  };

  const getCouponStatus = (coupon) => {
    if (coupon.isWinner) {
      return {
        text: "Winner",
        icon: <FiAward className="mr-2" />,
        color: "bg-purple-100 text-purple-700"
      };
    }
    
    if (coupon.offerId?.status === "ended" && coupon.offerId?.winnersAnnounced) {
      return {
        text: "Closed",
        icon: <FiXCircle className="mr-2" />,
        color: "bg-gray-100 text-gray-700"
      };
    }

    return coupon.paymentStatus === "success" 
      ? {
          text: "Active",
          icon: <FiCheckCircle className="mr-2" />,
          color: "bg-green-100 text-green-700"
        }
      : {
          text: "Pending",
          icon: <FiClock className="mr-2" />,
          color: "bg-yellow-100 text-yellow-700"
        };
  };

  return (
    <div className="max-w-6xl mx-auto px-1 md:px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">My Coupons</h1>

      {loading ? (
        <div className="animate-pulse bg-white shadow-lg p-6 rounded-lg">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No coupons found.</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b text-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-bold">Coupon Number</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Offer</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Winning Package</th>
                  <th className="text-left py-4 px-6 text-sm font-bold">Purchase Date</th>
                  <th className="text-center py-4 px-6 text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, index) => {
                  const status = getCouponStatus(coupon);
                  return (
                    <tr
                      key={coupon._id}
                      className={`border-b transition hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{coupon.couponNumber.toString().padStart(6, '0')}
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-500">
                        {coupon.offerId?.title || 'Offer details'}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full w-max ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-500">
                        {coupon.isWinner 
                          ? (coupon.associatedPackage?.title || 'No package assigned')
                          : '-'}
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(coupon.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          className="flex items-center justify-center mx-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
                          onClick={() => handleViewDetails(coupon._id)}
                        >
                          <FiEye className="mr-2" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden">
            {coupons.map((coupon) => {
              const status = getCouponStatus(coupon);
              return (
                <div key={coupon._id} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                      <FiTag className="mr-2 text-orange-500" />
                      #{coupon.couponNumber.toString().padStart(6, '0')}
                    </h2>

                    <span className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full w-max ${status.color}`}>
                      {status.icon}
                      {status.text}
                    </span>
                  </div>

                  <p className="text-gray-700 mt-2 font-medium">{coupon.offerId?.title || 'Offer details'}</p>

                  {coupon.isWinner && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Winning Package: </span>
                      <span className="text-gray-600">
                        {coupon.associatedPackage?.title || 'No package assigned'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center mt-3 text-gray-500 text-sm">
                    <FiCreditCard className="mr-2" />
                    <span>Purchased: {new Date(coupon.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition flex items-center justify-center"
                    onClick={() => handleViewDetails(coupon._id)}
                  >
                    <FiEye className="mr-2" />
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCoupons;