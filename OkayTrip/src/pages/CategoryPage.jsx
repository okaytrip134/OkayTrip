import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserAuth from "../components/UserAuth";
import { FaStar } from "react-icons/fa";

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
  const API_URL = "http://localhost:8000";
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
  const [packageRatings, setPackageRatings] = useState({});
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });

  const handleBooking = (packageId) => {
    if (!userToken) {
      setSelectedPackageId(packageId); 
      setShowAuthPopup(true); 
    } else {
      navigate(`/booking/${packageId}`); 
    }
  };

  // Move all useEffect hooks to the top level of the component
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

  useEffect(() => {
    if (Object.keys(packages).length === 0) return;

    Object.values(packages).flat().forEach((pkg) => {
      fetchReviews(pkg._id);
    });
  }, [packages]);

  useEffect(() => {
    const fetchRatingsForPackages = async () => {
      // Only proceed if we have packages loaded
      const allPackages = Object.values(packages).flat();
      if (allPackages.length === 0) return;

      // Create a batch of requests for all package ratings
      const ratingPromises = allPackages.map(pkg =>
        fetch(`${import.meta.env.VITE_APP_API_URL}/api/reviews/${pkg._id}/rating`)
          .then(res => res.ok ? res.json() : { averageRating: 0, totalReviews: 0 })
          .then(data => ({
            packageId: pkg._id,
            averageRating: data.averageRating || 0,
            totalReviews: data.totalReviews || 0
          }))
          .catch(() => ({ packageId: pkg._id, averageRating: 0, totalReviews: 0 }))
      );

      // Wait for all requests to complete
      const ratings = await Promise.all(ratingPromises);

      // Convert array to object mapped by package ID
      const ratingsMap = ratings.reduce((acc, item) => {
        acc[item.packageId] = {
          averageRating: item.averageRating,
          totalReviews: item.totalReviews
        };
        return acc;
      }, {});

      setPackageRatings(ratingsMap);
    };

    fetchRatingsForPackages();
  }, [packages]);

  const fetchReviews = async (packageId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/reviews/${packageId}`);

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      console.log("Fetched Reviews for Package:", packageId, data);

      setReviews((prev) => ({
        ...prev,
        [packageId]: data.reviews || [],
      }));

      // Calculate rating statistics
      const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          stats[review.rating]++;
        }
      });

      setRatingStats((prev) => ({
        ...prev,
        [packageId]: stats,
      }));

    } catch (error) {
      console.error("Error fetching reviews for package:", packageId, error);
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

  if (loading && !packages.length) {
    return (
      <div className="w-full max-w-[1100px] mx-auto px-4 lg:px-8 py-4 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-full max-w-[350px]">
              <PackageSkeleton />
            </div>
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

  const isPackageDatePassed = (pkg) => {
    if (!pkg.endDate || isNaN(new Date(pkg.endDate))) return false; // Fully ignore invalid/missing date
    const endDate = new Date(pkg.endDate);
    const today = new Date();
    return endDate < today;
  };

  const isPackageAvailable = (pkg) => {
    return pkg.isActive && pkg.availableSeats > 0 && !isPackageDatePassed(pkg);
  };

  const handlePackageClick = (pkg) => {
    if (isPackageAvailable(pkg)) {
      window.location.href = `/package/${pkg._id}`;
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 lg:px-0 py-4 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Packages in this {category}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center">
        {packages.map((pkg, index) => {
          const packageProps =
            index === packages.length - 1
              ? { ref: lastPackageElementRef }
              : {};

          return (
            <div
              key={pkg._id}
              {...packageProps}
              className="w-full max-w-[350px] rounded relative bg-white"
              onClick={() => handlePackageClick(pkg)}
            >
              <div className="relative">
                <BlurImage
                  src={`${import.meta.env.VITE_APP_API_URL}${pkg.images[0]}`}
                  alt={pkg.title}
                />

                {(!pkg.isActive || isPackageDatePassed(pkg)) && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-black bg-opacity-70 w-full h-full absolute rounded-t-2xl flex items-center justify-center">
                      <div className="text-white text-7xl text-start font-bold text-opacity-80 px-6 py-3 rounded-lg transform shadow-lg">
                        <h2>Coming <br /> <span>Soon</span></h2>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sold Out Overlay when no seats available */}
                {pkg.isActive && pkg.availableSeats === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-black bg-opacity-70 w-full h-full absolute rounded-t-2xl flex items-center justify-center">
                      <div className="text-white text-6xl text-start font-bold text-opacity-80 px-6 py-3 rounded-lg transform shadow-lg">
                        <h2>Seat Sold <br /> <span>Out</span></h2>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={`bg-white rounded-b-2xl py-4 px-4 lg:px-0 w-full ${!isPackageAvailable(pkg) ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">{pkg.duration}</p>
                  <div className="flex items-center space-x-1 text-green-600 text-xs">
                    <span className="text-gray-400">Available Seats</span>
                    <span>{pkg.availableSeats}</span>
                  </div>
                </div>

                {/* Content Element 2: Title */}
                <div className="content-element mb-2 h-14 overflow-hidden">
                  <h3 className="text-base font-medium text-gray-800 line-clamp-2">{pkg.title}</h3>
                </div>


                {pkg.startDate && pkg.endDate && (
                  <p className="text-sm text-gray-500 mb-0">
                    {new Date(pkg.startDate).toLocaleDateString()} - {" "}/
                    {new Date(pkg.endDate).toLocaleDateString()}
                  </p>
                )}
                {/* Element: 6 */}
                <div className="flex justify-between items-center mb-0">
                  <div
                    className="flex flex-1 relative rounded-md"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 186, 10, .1), rgba(255, 186, 10, 0));'
                    }}
                  >
                    <div className="flex items-center overflow-hidden gap-[5px] h-8 px-0">
                      <div className="flex items-center gap-1">
                        <span className="flex items-center text-xs font-semibold text-[#000]">
                          {pkg.duration.split(" ")[0]}
                        </span>
                        <span className="flex items-center text-xs font-normal text-[#515151] truncate">
                          {pkg.categoryId ? pkg.categoryId.name : "Category not available"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Package Rating */}
                  <div className="flex items-center gap-2 ml-2">
                    <span className="flex items-center text-[#19ad6f] font-bold">
                      {(packageRatings[pkg._id]?.averageRating || 4.3).toFixed(1)}
                      <span className="flex ml-1">
                        <FaStar size={16} />
                      </span>
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({reviews[pkg._id]?.length || 20})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-start mb-4 flex-wrap">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-green-600 mr-2">
                      ₹{pkg.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through mr-2">
                      ₹{pkg.realPrice}
                    </span>

                    {pkg.realPrice > pkg.discountedPrice && (
                      <div className="flex items-center">
                        <span className="h-[24px] ml-[5px]">
                          <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                          </svg>
                        </span>
                        <span className="text-[#0b822a] text-[9px] font-medium bg-gradient-to-r from-[#0b822a1c] to-[#0b822a1a] px-2 py-1 rounded">
                          Save ₹{(pkg.realPrice - pkg.discountedPrice).toLocaleString()}
                        </span>
                        <span className="h-[24px] rotate-180">
                          <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-3 mt-4">
                  <a
                    href="tel:+917542003073"
                    className={`flex items-center justify-center h-[51px] w-[51px] border rounded-md border-[#f37002] text-[#f37002] hover:bg-[#f37002] hover:text-white text-[14px] font-semibold transition-colors ${!isPackageAvailable(pkg) ? 'pointer-events-none opacity-70' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                      <path d="M12.7538 10.1683L11.0772 9.9768C10.8801 9.95363 10.6802 9.97547 10.4927 10.0407C10.3052 10.1059 10.1349 10.2128 9.99464 10.3533L8.78006 11.5685C6.90617 10.615 5.38306 9.09099 4.43002 7.21606L5.6512 5.9942C5.93505 5.7102 6.07367 5.30732 6.02746 4.91104L5.83603 3.24667C5.80038 2.92436 5.64748 2.62643 5.40646 2.40963C5.16544 2.19283 4.85314 2.07232 4.52904 2.07104H3.38707C2.64116 2.07104 2.02067 2.69188 2.06688 3.43821C2.41673 9.07857 6.92519 13.5829 12.5558 13.933C13.3017 13.9792 13.9222 13.3584 13.9222 12.6121V11.4694C13.9288 10.809 13.4205 10.241 12.7538 10.1683Z" fill="currentColor"></path>
                    </svg>
                  </a>

                  <button
                    className={`flex-1 bg-[#f37002] text-white flex items-center justify-center h-[51px] border border-[#f37002] rounded-md text-[14px] font-semibold hover:bg-transparent hover:text-[#f37002] transition-colors ${!isPackageAvailable(pkg) ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to package details
                      if (isPackageAvailable(pkg)) {
                        handleBooking(pkg._id); // Handle booking logic only if available
                      }
                    }}
                  >
                    <span>
                      {!pkg.isActive || isPackageDatePassed(pkg) ? "Coming Soon" :
                        pkg.availableSeats === 0 ? "Sold Out" : "View Details"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <>
            <div className="w-full max-w-[350px]"><PackageSkeleton /></div>
            <div className="w-full max-w-[350px]"><PackageSkeleton /></div>
            <div className="w-full max-w-[350px]"><PackageSkeleton /></div>
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