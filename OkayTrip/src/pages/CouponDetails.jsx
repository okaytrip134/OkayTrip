import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiAward, FiXCircle, FiPackage, FiInfo } from "react-icons/fi";

const CouponDetail = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!couponId) {
      setError("Coupon ID is missing!");
      setLoading(false);
      navigate("/");
      return;
    }

    const fetchCouponDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/coupon/view-coupon/${couponId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(
            response.status === 404 ? "Coupon not found" : "Failed to fetch coupon"
          );
        }
        
        const data = await response.json();
        setCoupon(data);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCouponDetails();
  }, [couponId, navigate]);

  const getStatusDetails = () => {
    if (coupon.isWinner) {
      return {
        text: "Winner",
        icon: <FiAward className="mr-1" />,
        color: "bg-purple-100 text-purple-800",
        note: "Congratulations! You've won this offer"
      };
    }
    
    if (coupon.offerId?.status === "ended" && coupon.offerId?.winnersAnnounced) {
      return {
        text: "Closed",
        icon: <FiXCircle className="mr-1" />,
        color: "bg-gray-100 text-gray-800",
        note: "This offer has ended and winners have been announced"
      };
    }

    return coupon.paymentStatus === "success" 
      ? {
          text: "Active",
          icon: <FiCheckCircle className="mr-1" />,
          color: "bg-green-100 text-green-800",
          note: "Your coupon is active and valid"
        }
      : {
          text: "Pending",
          icon: <FiClock className="mr-1" />,
          color: "bg-yellow-100 text-yellow-800",
          note: "Waiting for payment confirmation"
        };
  };

  if (loading) return <div className="p-8 text-center">Loading coupon details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!coupon) return <div className="p-8 text-center">Coupon not found</div>;

  const status = getStatusDetails();

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <FiPackage className="mr-2 text-orange-500" />
          Coupon #{coupon.couponNumber.toString().padStart(6, '0')}
        </h2>

        {/* Status Banner */}
        <div className={`${status.color} p-3 rounded-lg mb-6 flex items-start`}>
          <div className="flex-1">
            <p className="font-medium flex items-center">
              {status.icon}
              {status.text}
            </p>
            <p className="text-sm mt-1">{status.note}</p>
          </div>
          {coupon.isUsed && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Already Used
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700">Offer</h3>
            <p>{coupon.offerId?.title || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Purchase Date</h3>
            <p>{new Date(coupon.createdAt).toLocaleString()}</p>
          </div>
          
          {coupon.isWinner && (
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-700">Winning Package</h3>
              <p className="text-lg font-medium">
                {coupon.associatedPackage?.title || 'No package assigned'}
              </p>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-gray-700">Payment ID</h3>
            <p className="font-mono text-sm break-all">{coupon.paymentId}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Valid Until</h3>
            <p>{new Date(coupon.offerId?.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
            <FiInfo className="mr-2" /> Usage Instructions
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              {coupon.isWinner 
                ? "Present this coupon number when booking your winning package"
                : "Present this coupon number at checkout"}
            </li>
            <li>Show valid ID if requested</li>
            {coupon.isWinner && (
              <li className="font-medium">
                Note: This winning coupon can only be used once
              </li>
            )}
            <li>
              Offer valid until {new Date(coupon.offerId?.endDate).toLocaleDateString()}
            </li>
          </ol>
          
          {coupon.isUsed && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              This coupon has already been used and cannot be redeemed again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponDetail;