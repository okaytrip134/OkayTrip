import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserAuth from "../components/UserAuth";
// Skeleton Component
const PackageSkeleton = () => (
  <div className="rounded animate-pulse">
    <div className="h-[340px] bg-gray-300 rounded-2xl mb-2"></div>
    <div className="space-y-3 p-4 bg-white">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

// Blur Image Component
const BlurImage = ({ src, alt }) => {

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-[340px] overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-2xl ${imageLoaded ? "blur-none" : "blur-md"
          } transition-all duration-300 ease-in-out`}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
        onError={(e) => (e.target.src = "/fallback-image.png")}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(""); // Store Category Name
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null); // Store package ID
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  const handleBooking = (packageId) => {
    if (!userToken) {
      setSelectedPackageId(packageId); // Store package ID
      setShowAuthPopup(true); // Show login popup
    } else {
      navigate(`/booking/${packageId}`); // Redirect if logged in
    }
  };

  const lastPackageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/categories/`);
        const categoryData = data.find(cat => cat._id === categoryId);
        setCategory(categoryData?.name || "Unknown Category");
      } catch (error) {
        console.error("Error fetching category details:", error.message);
        setCategory("Unknown Category");
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/packages/category/${categoryId}`);
        setPackages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages by category:", error.message);
        setLoading(false);
      }
    };

    fetchPackages();
  }, [categoryId]);
  if (!packages.length && loading) {
    return (
      <div className="px-8 lg:px-32 py-8 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PackageSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!packages.length) {
    return (
      <div className="text-center py-10">
        No packages available for this category.
      </div>
    );
  }

  return (
    <div className="px-8 lg:px-32 py-8 min-h-screen max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tours In {category}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const packageProps =
            index === packages.length - 1
              ? { ref: lastPackageElementRef }
              : {};

          return (
            <div
              key={pkg._id}
              {...packageProps}
              className="rounded transition snap-center w-[340px] cursor-pointer"
              onClick={() => (window.location.href = `/package/${pkg._id}`)} // Redirect on click
            >
              <BlurImage
                src={`${import.meta.env.VITE_APP_API_URL}${pkg.images[0]}`}
                alt={pkg.title}
              />

              <div className="bg-white rounded-b p-4 w-[340px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">{pkg.duration}</p>

                  <div className="flex items-center space-x-1 text-green-600 text-xs">
                    <span className="text-gray-400">Avialable Seats</span>
                    <span>{pkg.availableSeats}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {pkg.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                  {new Date(pkg.endDate).toLocaleDateString()}
                </p>

                <div
                  className="flex w-full relative rounded-md mb-[2px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 186, 10, .1), rgba(255, 186, 10, 0));'
                  }}
                >
                  <div className="productcard_destinationListBOx flex items-center overflow-hidden, gap-[5px] h-8 my-0 mr-32px ml-7px">
                    <div className="flex w-max items-center gap-1">
                      <span className="flex items-center text-xs font-semibold text-[#000]">
                        {pkg.duration.split(" ")[0]}D
                      </span>
                      <span className="flex items-center text-[10px] font-normal text-[#515151] w-max uppercase"
                        style={
                          {
                            fontFamily: 'Helvetica',
                            letterSpacing: '1px'
                          }
                        }
                      >
                        {pkg.categoryId ? pkg.categoryId.name : "Category not available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ₹{pkg.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{pkg.realPrice}
                    </span>
                    <span className="LeadForm_SavePrice_leftBorderICon h-[24px] ml-[5px]"><svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path></svg>
                    </span>
                    {pkg.realPrice > pkg.discountedPrice && (
                      <span className="LeadForm_saveprice"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px 2px',
                          color: '#0b822a',
                          fontSize: '9px',
                          fontWeight: '500',
                          lineHeight: '14px',
                          textTransform: "capitalize",
                          background: 'linear-gradient(90deg, #0b822a1c 3.64%, #0b822a1a)',
                          gap: '3px',
                          marginLeft: '-.5px',
                          marginRight: '-.5px'
                        }}
                      >
                        Save ₹{(pkg.realPrice - pkg.discountedPrice).toLocaleString()}
                      </span>
                    )}
                    <span className="LeadForm_savePrice_RightBorderIcon"
                      style={{
                        transform: 'rotate(180deg)',
                        height: '24px',
                        margin: '0'
                      }}
                    >
                      <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path></svg>
                    </span>
                  </div>
                </div>
                <div className="ProductCard_ButtonContainer flex flex-row justify-between mt-[10px]">
                  <a href="tel:+917542003073" className="flex items-center h-[51px] w-[51px] border rounded-md border-solid border-[#f37002] text-[#f37002] hover:bg-[#f37002] hover:text-white justify-center text-[14px] font-semibold">
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M12.7538 10.1683L11.0772 9.9768C10.8801 9.95363 10.6802 9.97547 10.4927 10.0407C10.3052 10.1059 10.1349 10.2128 9.99464 10.3533L8.78006 11.5685C6.90617 10.615 5.38306 9.09099 4.43002 7.21606L5.6512 5.9942C5.93505 5.7102 6.07367 5.30732 6.02746 4.91104L5.83603 3.24667C5.80038 2.92436 5.64748 2.62643 5.40646 2.40963C5.16544 2.19283 4.85314 2.07232 4.52904 2.07104H3.38707C2.64116 2.07104 2.02067 2.69188 2.06688 3.43821C2.41673 9.07857 6.92519 13.5829 12.5558 13.933C13.3017 13.9792 13.9222 13.3584 13.9222 12.6121V11.4694C13.9288 10.809 13.4205 10.241 12.7538 10.1683Z" fill="var(--primary, #f37002)"></path></svg>
                    </div>
                  </a>
                  <div className="productCard_Button bg-[#f37002] text-white flex items-center justify-center h-[51px] border border-solid border-[#f37002] rounded-md text-[14px] font-semibold hover:bg-transparent hover:text-[#f37002] "
                    style={{
                      width: 'calc(100% - 61px)'
                    }}
                  >
                    <span className="  ">View Details</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <>
            <PackageSkeleton />
            <PackageSkeleton />
            <PackageSkeleton />
          </>
        )}
      </div>

      {!hasMore && (
        <div className="text-center mt-6 text-gray-500">
          No more packages to load
        </div>
      )}
      {/* Show Authentication Popup */}
      {showAuthPopup && (
        <UserAuth
          onClose={() => {
            setShowAuthPopup(false);
            const token = localStorage.getItem("userToken");
            if (token && selectedPackageId) {
              navigate(`/booking/${selectedPackageId}`); // Redirect to booking page
            }
          }}
        />
      )}
    </div>
  );
};

export default CategoryPage;
