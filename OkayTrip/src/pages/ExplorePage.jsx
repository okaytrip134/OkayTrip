import React, { useEffect, useState, useRef } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserAuth from "../components/UserAuth";
import Footer from "../components/Footer";
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
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState({});
  const [loadedCategories, setLoadedCategories] = useState({});
  const adminToken = localStorage.getItem("adminToken");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null); // Store package ID
  const [visibleLeftButtons, setVisibleLeftButtons] = useState({}); // Track left button visibility
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoriesData } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/`
        );

        // ✅ Filter only active categories
        const activeCategories = categoriesData.filter((category) => category.isActive);
        const filteredCategories = [];

        // ✅ Fetch packages for each category & filter only categories with packages
        for (const category of activeCategories) {
          try {
            const { data: categoryPackages } = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/category/${category._id}`
            );

            if (categoryPackages.length > 0) {
              filteredCategories.push(category);
              setPackages((prev) => ({
                ...prev,
                [category._id]: categoryPackages,
              }));
            }
          } catch (error) {
            console.error(`Error fetching packages for category ${category._id}:`, error.message);
          }
        }

        setCategories(filteredCategories); // ✅ Update only categories with packages
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchData();
  }, []);

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
  return (
    <div className="px-4 md:px-8 lg:px-32 py-8 min-h-screen max-w-[1440px] mx-auto">
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
                  className="absolute left-[-32px] top-[30%] border-[1px] border-solid border-gray-500 transform -translate-y-1/2 z-[4] bg-[hsla(0,0%,100%,.7)] p-5 rounded-full shadow hover:bg-gray-100 hidden md:block"
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
                      className=" rounded transition snap-center cursor-pointer"
                      onClick={() => (window.location.href = `/package/${pkg._id}`)}
                    >
                      {/* Top Container for Image */}
                      <div className="top-container overflow-hidden rounded-t relative w-[285px] md:w-[340px] h-[340px]">
                        <img
                          src={`${import.meta.env.VITE_APP_API_URL}${pkg.images[0]}`}
                          alt={pkg.title}
                          className="w-full h-full object-cover rounded-2xl transition-all duration-300 blur-sm hover:blur-none"
                          onLoad={(e) => e.target.classList.remove('blur-sm')}
                          onError={(e) => {
                            e.target.src = "/fallback-image.png";
                            e.target.classList.remove('blur-sm');
                          }}
                          loading="lazy"
                        />
                      </div>

                      {/* Create Space Between Image and Content */}
                      <div className="h-2"></div>

                      {/* Bottom Container for Content */}
                      <div className="bottom-container bg-white rounded-b w-[295px] md:w-[340px]">
                        {/* Content Element 1: Duration and Ratings */}
                        <div className="content-element flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-500">{pkg.duration}</p>
                          <div className="flex items-center space-x-1 text-green-600 text-xs">
                            <span className="text-gray-400">Avialable Seats</span>
                            <span>{pkg.availableSeats}</span>
                          </div>
                        </div>

                        {/* Content Element 2: Title */}
                        <div className="content-element mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>
                        </div>

                        {/* Content Element 3: Date */}
                        <div className="content-element mb-2">
                          <p className="text-sm text-gray-500">
                            {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                            {new Date(pkg.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        {/* Element: 6 */}
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
                className=" absolute right-[-32px] top-[30%] border-[1px] border-solid border-gray-500 transform -translate-y-1/2 z-0 bg-[hsla(0,0%,100%,.7)] p-5 rounded-full shadow hover:bg-gray-100 hidden md:block"
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