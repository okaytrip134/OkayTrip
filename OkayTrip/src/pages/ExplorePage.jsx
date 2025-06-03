import React, { useEffect, useState, useRef } from "react";
import { FaChevronRight, FaChevronLeft, FaStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserAuth from "../components/UserAuth";
import Footer from "../components/Footer";

// Blur Image Component (copied from CategoryPage)
const BlurImage = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
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

// Skeleton Component for Package Card
const PackageCardSkeleton = () => (
  <div className="w-[340px] min-w-[90%] sm:min-w-[45%] lg:min-w-[30%] rounded transition snap-center animate-pulse">
    <div className="top-container overflow-hidden rounded-t relative w-[340px] h-[340px] bg-gray-300"></div>
    <div className="bottom-container bg-white rounded-b p-4 w-[340px] space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const ExplorePage = () => {
  const { packageId } = useParams();
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState({});
  const [loadedCategories, setLoadedCategories] = useState({});
  const adminToken = localStorage.getItem("adminToken");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null); // Store package ID
  const [visibleLeftButtons, setVisibleLeftButtons] = useState({}); // Track left button visibility
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [packageRatings, setPackageRatings] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });

  const getTotalReviewCount = () => {
    return Object.values(ratingStats).reduce((sum, count) => sum + count, 0);
  };
  const handleBooking = (packageId) => {
    if (!userToken) {
      setSelectedPackageId(packageId); // Store package ID
      setShowAuthPopup(true); // Show login popup
    } else {
      navigate(`/booking/${packageId}`); // Redirect if logged in
    }
  };
  useEffect(() => {
    if (Object.keys(packages).length === 0) return;

    Object.values(packages).flat().forEach((pkg) => {
      fetchReviews(pkg._id);
    });
  }, [packages]);
  const fetchReviews = async (packageId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/reviews/${packageId}`);

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      console.log("Fetched Reviews for Package:", packageId, data); // ✅ Debugging ke liye

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

      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews for package:", packageId, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoriesData } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/`
        );

        // ✅ Get all active categories
        const activeCategories = categoriesData.filter((category) => category.isActive);
        const filteredCategories = [];

        // ✅ Fetch packages for each category & include categories with packages
        for (const category of activeCategories) {
          try {
            const { data: categoryPackages } = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/category/${category._id}`
            );

            // Include categories that have at least one package (active or inactive)
            if (categoryPackages.length > 0) {
              filteredCategories.push(category);
              setPackages((prev) => ({
                ...prev,
                [category._id]: categoryPackages, // Store all packages including inactive ones
              }));
            }
          } catch (error) {
            console.error(`Error fetching packages for category ${category._id}:`, error.message);
          }
        }

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver(async (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id.replace('category-', '');

          // Skip if already loaded
          if (loadedCategories[categoryId]) return;

          try {
            const { data: categoryPackages } = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/category/${categoryId}`
            );

            setPackages(prev => ({
              ...prev,
              [categoryId]: categoryPackages
            }));

            setLoadedCategories(prev => ({
              ...prev,
              [categoryId]: true
            }));

            // Disconnect observer for this category
            observer.unobserve(entry.target);
          } catch (error) {
            console.error(`Error fetching packages for category ${categoryId}:`, error.message);
          }
        }
      });
    }, observerOptions);

    // Observe categories that haven't been loaded
    categories.forEach(category => {
      const categoryElement = document.getElementById(`category-${category._id}`);
      if (categoryElement && !loadedCategories[category._id]) {
        observer.observe(categoryElement);
      }
    });

    return () => observer.disconnect();
  }, [categories, loadedCategories]);

  useEffect(() => {
    categories.forEach((category) => {
      const carousel = document.getElementById(`carousel-${category._id}`);

      if (carousel) {
        // ✅ Listen for scroll events to dynamically update left button visibility
        const handleScroll = () => {
          setVisibleLeftButtons((prev) => ({
            ...prev,
            [category._id]: carousel.scrollLeft > 0, // Show button if scrolled right
          }));
        };

        carousel.addEventListener("scroll", handleScroll);
        return () => carousel.removeEventListener("scroll", handleScroll);
      }
    });
  }, [categories]);
const isPackageDatePassed = (pkg) => {
  if (!pkg.endDate || isNaN(new Date(pkg.endDate))) return false; // Fully ignore invalid/missing date
  const endDate = new Date(pkg.endDate);
  const today = new Date();
  return endDate < today;
};
  const scrollCarousel = (categoryId, direction) => {
    const carousel = document.getElementById(`carousel-${categoryId}`);
    if (!carousel) return;

    const scrollAmount = 300;
    const newScrollPosition = direction === "left"
      ? carousel.scrollLeft - scrollAmount
      : carousel.scrollLeft + scrollAmount;

    carousel.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
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
    <div className="px-4 lg:px-0 py-8 bg-white min-h-screen max-w-[1100px] mx-auto" >
      {categories.length === 0 ? (
        <div></div>
      ) : (

        categories.map((category) => (
          <div
            key={category._id}
            id={`category-${category._id}`}
            className="mb-12"

          >
            {/* Category Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
              <a
                href={`/category/${category._id}`}
                className="text-orange-500 hover:underline text-sm"
              >
                View All
              </a>
            </div>

            {/* Carousel */}
            <div className="relative">
              {visibleLeftButtons[category._id] && (
                <button
                  className="hidden md:block absolute left-[-20px] md:left-[-32px] top-[30%] border-[1px] border-solid border-gray-500 transform -translate-y-1/2 z-[4] bg-[hsla(0,0%,100%,.7)] p-5 rounded-full shadow hover:bg-gray-100"
                  onClick={() => scrollCarousel(category._id, 'left')}
                >
                  <FaChevronLeft size={16} />
                </button>
              )}
              <div
                id={`carousel-${category._id}`}
                className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              >
                {!packages[category._id]
                  ? Array(6).fill().map((_, index) => (
                    <PackageCardSkeleton key={index} />
                  ))
                  : packages[category._id].slice(0, 6).map((pkg) => (
                    <div
                      key={pkg._id}
                      className="rounded transition snap-center cursor-pointer relative"
                      onClick={() => handlePackageClick(pkg)}
                    >
                      {/* Top Container for Image - Updated with BlurImage component */}
                      <div className="top-container overflow-hidden rounded-t relative w-[295px] md:w-[340px] h-[340px]">
                        <BlurImage
                          src={`${import.meta.env.VITE_APP_API_URL}${pkg.images[0]}`}
                          alt={pkg.title}
                        />
                        {(!pkg.isActive || isPackageDatePassed(pkg)) && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-black bg-opacity-70 w-full h-full absolute rounded-lg flex items-center justify-center">
                              <div className="text-white text-7xl text-start font-bold text-opacity-80 px-6 py-3 rounded-lg transform shadow-lg">
                                <h2>Coming <br /> <span>Soon</span></h2>
                              </div>
                            </div>
                          </div>
                        )}


                        {/* Sold Out Overlay when no seats available */}
                        {pkg.isActive && pkg.availableSeats === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-black bg-opacity-70 w-full h-full absolute rounded-lg flex items-center justify-center">
                              <div className="text-white text-6xl text-start font-bold text-opacity-80 px-6 py-3 rounded-lg transform shadow-lg">
                                <h2>Seat Sold <br /> <span>Out</span></h2>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="h-2"></div>

                      {/* Bottom Container for Content */}
                      <div className={`bottom-container bg-white rounded-b w-[295px] md:w-[340px] ${!isPackageAvailable(pkg) ? 'opacity-60' : ''}`}>
                        {/* Content Element 1: Duration and Ratings */}
                        <div className="content-element flex items-center justify-between ">
                          <p className="text-sm text-gray-500">{pkg.duration}</p>
                          <div className="flex items-center space-x-1 text-green-600 text-xs">
                            <span className="text-gray-400">Avialable Seats</span>
                            <span>{pkg.availableSeats}</span>
                          </div>
                        </div>

                        {/* Content Element 2: Title */}
                        <div className="content-element mb-0 h-14 overflow-hidden">
                          <h3 className="text-base font-medium text-gray-800">{pkg.title}</h3>
                        </div>

                        {/* Content Element 3: Date */}
                        <div className="content-element mb-0">
                          {pkg.startDate && pkg.endDate && (
                            <p className="text-sm text-gray-500">
                              {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                              {new Date(pkg.endDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {/* Element: 6 */}
                        <div className="flex justify-between">
                          <div
                            className="flex w-full relative rounded-md mb-[2px]"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 186, 10, .1), rgba(255, 186, 10, 0));'
                            }}
                          >
                            <div className="productcard_destinationListBOx flex items-center overflow-hidden, gap-[5px] h-8 my-0 mr-32px ml-7px">
                              <div className="flex w-max items-center gap-1">
                                <span className="flex items-center text-xs font-semibold text-[#000]">
                                  {pkg.duration.split(" ")[0]}
                                </span>
                                <span className="flex items-center text-xs font-normal text-[#515151] w-max">
                                  {pkg.categoryId ? pkg.categoryId.name : "Category not available"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Package Rating */}
                          <div className="package_rating flex items-center justify-end gap-2">
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
                        {/* Content Element 4: Price */}
                        <div className="content-element flex items-center justify-between mb-4">
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
                        {/* Content Element 5: Buttons */}
                        <div className="ProductCard_ButtonContainer flex flex-row justify-between mt-[10px]">
                          <a href="tel:+917542003073" className={`flex items-center h-[51px] w-[51px] border rounded-md border-solid border-[#f37002] text-[#f37002] hover:text-white justify-center text-[14px] font-semibold ${!isPackageAvailable(pkg) ? 'pointer-events-none opacity-70' : ''}`}>
                            <div className="flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M12.7538 10.1683L11.0772 9.9768C10.8801 9.95363 10.6802 9.97547 10.4927 10.0407C10.3052 10.1059 10.1349 10.2128 9.99464 10.3533L8.78006 11.5685C6.90617 10.615 5.38306 9.09099 4.43002 7.21606L5.6512 5.9942C5.93505 5.7102 6.07367 5.30732 6.02746 4.91104L5.83603 3.24667C5.80038 2.92436 5.64748 2.62643 5.40646 2.40963C5.16544 2.19283 4.85314 2.07232 4.52904 2.07104H3.38707C2.64116 2.07104 2.02067 2.69188 2.06688 3.43821C2.41673 9.07857 6.92519 13.5829 12.5558 13.933C13.3017 13.9792 13.9222 13.3584 13.9222 12.6121V11.4694C13.9288 10.809 13.4205 10.241 12.7538 10.1683Z" fill="var(--primary, #f37002)"></path></svg>
                            </div>
                          </a>
                          <div className={`productCard_Button bg-[#f37002] text-white flex items-center justify-center h-[51px] border border-solid border-[#f37002] rounded-md text-[14px] font-semibold hover:bg-transparent hover:text-[#f37002] ${!isPackageAvailable(pkg) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            style={{
                              width: 'calc(100% - 61px)'
                            }}
                          >
                            <span className="">
                              {!pkg.isActive || isPackageDatePassed(pkg) ? "Coming Soon" :
                                pkg.availableSeats === 0 ? "Sold Out" : "View Details"}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                  ))}

              </div>

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
              <button
                className="hidden md:block absolute right-[-20px] md:right-[-32px] top-[30%] border-[1px] border-solid border-gray-500 transform -translate-y-1/2 z-0 bg-[hsla(0,0%,100%,.7)] p-5 rounded-full shadow hover:bg-gray-100"
                onClick={() => scrollCarousel(category._id, 'right')}
              >
                <FaChevronRight size={16} />
              </button>
            </div>
          </div>
        ))
      )}
      {/* <Footer/>  */}
    </div>
  );
};

export default ExplorePage;