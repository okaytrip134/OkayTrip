import React, { useState, useEffect } from "react";
import { Calendar, Search, X } from "lucide-react";

const SearchPopup = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [canSearch, setCanSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [packageRatings, setPackageRatings] = useState({});
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    if (searchTerm || startDate || endDate || tripDuration) {
      setCanSearch(true);
    } else {
      setCanSearch(false);
    }
  }, [searchTerm, startDate, endDate, tripDuration]);

  const fetchPackages = async (searchParams) => {
    setLoading(true);
    try {
      // This would be replaced with your actual API endpoint
      const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";
      
      // Building query parameters
      const queryParams = new URLSearchParams();
      if (searchParams.searchTerm) queryParams.append("search", searchParams.searchTerm);
      if (searchParams.dateRange.startDate) queryParams.append("startDate", searchParams.dateRange.startDate);
      if (searchParams.dateRange.endDate) queryParams.append("endDate", searchParams.dateRange.endDate);
      if (searchParams.tripDuration) queryParams.append("duration", searchParams.tripDuration);
      if (searchParams.priceRange.min) queryParams.append("minPrice", searchParams.priceRange.min);
      if (searchParams.priceRange.max) queryParams.append("maxPrice", searchParams.priceRange.max);
      
      // In a real app, you would fetch from your API
      // For demonstration, we'll simulate a response
      // const response = await fetch(`${API_URL}/api/packages/search?${queryParams}`);
      // const data = await response.json();
      
      // Simulate API response with mock data
      const mockData = generateMockPackages(searchParams);
      setSearchResults(mockData);
      
      // Fetch ratings for each package
      await fetchRatingsForPackages(mockData);
      
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingsForPackages = async (packages) => {
    try {
      const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";
      const ratings = {};
      const reviewsData = {};
      
      // In a real app, we'd make actual API calls
      // Here we'll simulate ratings and reviews
      packages.forEach(pkg => {
        // Mock rating data
        const avgRating = (3.5 + Math.random() * 1.5).toFixed(1);
        const totalReviews = Math.floor(Math.random() * 50) + 10;
        
        ratings[pkg._id] = {
          averageRating: parseFloat(avgRating),
          totalReviews
        };
        
        // Mock review data
        reviewsData[pkg._id] = Array(totalReviews).fill().map(() => ({
          rating: Math.floor(Math.random() * 5) + 1
        }));
      });
      
      setPackageRatings(ratings);
      setReviews(reviewsData);
      
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  // Mock data generation function for demonstration
  const generateMockPackages = (searchParams) => {
    const { searchTerm, dateRange, tripDuration, priceRange } = searchParams;
    const destinations = ["Goa", "Manali", "Shimla", "Kerala", "Rajasthan", "Ladakh", "Andaman", "Uttarakhand"];
    const durations = ["2 to 3 Days", "3 to 5 Days", "5 to 7 Days", "7+ Days"];
    
    // Filter destinations based on search term if provided
    let filteredDestinations = destinations;
    if (searchTerm) {
      filteredDestinations = destinations.filter(dest => 
        dest.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Generate between 0-8 packages based on search criteria
    const numPackages = filteredDestinations.length;
    const packages = [];
    
    for (let i = 0; i < numPackages; i++) {
      const discountedPrice = Math.floor((Math.random() * (priceRange.max - priceRange.min) + priceRange.min) / 1000) * 1000;
      const realPrice = discountedPrice + Math.floor(Math.random() * 20000) + 5000;
      
      // Create a date range that fits the search criteria if provided
      let packageStartDate = new Date();
      packageStartDate.setDate(packageStartDate.getDate() + Math.floor(Math.random() * 30));
      
      if (dateRange.startDate) {
        packageStartDate = new Date(dateRange.startDate);
      }
      
      // Duration based on search criteria
      let packageDuration = durations[Math.floor(Math.random() * durations.length)];
      if (tripDuration) {
        packageDuration = tripDuration;
      }
      
      // Calculate end date based on duration
      let durationDays = 3;
      if (packageDuration === "3 to 5 Days") durationDays = 4;
      if (packageDuration === "5 to 7 Days") durationDays = 6;
      if (packageDuration === "7+ Days") durationDays = 8;
      
      const packageEndDate = new Date(packageStartDate);
      packageEndDate.setDate(packageStartDate.getDate() + durationDays);
      
      // Skip if doesn't match date criteria
      if (dateRange.endDate && new Date(dateRange.endDate) < packageEndDate) {
        continue;
      }
      
      // Create package object
      packages.push({
        _id: `pkg_${i}_${Date.now()}`,
        title: `${filteredDestinations[i]} Adventure Tour`,
        description: `Experience the beauty of ${filteredDestinations[i]} with our special package`,
        discountedPrice,
        realPrice,
        startDate: packageStartDate.toISOString(),
        endDate: packageEndDate.toISOString(),
        duration: packageDuration,
        images: [`/api/placeholder/340/340`], // Placeholder images
        isActive: true,
        availableSeats: Math.floor(Math.random() * 20) + 1,
        categoryId: { name: "Adventure" }
      });
    }
    
    return packages;
  };

  const handleSearch = () => {
    if (!canSearch) return;
    const searchData = {
      searchTerm,
      dateRange: { startDate, endDate },
      tripDuration,
      priceRange,
    };
    
    console.log("Search Data: ", searchData);
    fetchPackages(searchData);
    setShowResults(true);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: parseInt(value, 10),
    }));
  };

  const handleBooking = (packageId) => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      // Handle authentication logic
      alert("Please login to book this package");
    } else {
      // Redirect to booking page
      window.location.href = `/booking/${packageId}`;
    }
  };

  const isPackageAvailable = (pkg) => {
    return pkg.isActive && pkg.availableSeats > 0;
  };

  const handlePackageClick = (pkg) => {
    if (pkg.isActive && pkg.availableSeats > 0) {
      window.location.href = `/package/${pkg._id}`;
    }
  };

  // BlurImage component for package cards
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
          onError={(e) => {
            // Use a placeholder image on error
            e.target.src = "/api/placeholder/340/340";
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className={`bg-white rounded-2xl shadow-2xl ${showResults ? 'w-full max-w-6xl' : 'w-11/12 max-w-2xl'} p-8 mt-4 transform scale-90 opacity-0 animate-zoom-in`}
        style={{
          animation: "zoom-in 0.3s ease-out forwards",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            document.querySelector(".animate-zoom-in").style.animation =
              "zoom-out 0.3s ease-in forwards";
            setTimeout(onClose, 300);
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {!showResults ? (
          <>
            {/* Search Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Trip</h2>

            {/* Search Box */}
            <div className="mb-2 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Date Range */}
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-0 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                Travel Dates
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-0">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-0">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Trip Duration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800">Duration Preference</h3>
              <div className="flex flex-wrap gap-2">
                {["Upto 1 Day", "2 to 3 Days", "3 to 5 Days", "5 to 7 Days", "7+ Days"].map(
                  (duration) => (
                    <button
                      key={duration}
                      className={`px-6 py-3 border-2 rounded-xl font-medium transition-all ${
                        tripDuration === duration
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                      }`}
                      onClick={() => setTripDuration(duration)}
                    >
                      {duration}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget Range</h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-32 px-4 py-3 border-2 rounded-xl text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  min="0"
                  max={priceRange.max}
                />
                <span className="text-gray-400 font-medium">to</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-32 px-4 py-3 border-2 rounded-xl text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  min={priceRange.min}
                  max="500000"
                />
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-2 bg-orange-500 rounded-full"
                    style={{
                      left: `${(priceRange.min / 500000) * 100}%`,
                      right: `${100 - (priceRange.max / 500000) * 100}%`,
                    }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="absolute w-full h-2 opacity-0 cursor-pointer"
                  style={{ zIndex: 2 }}
                />
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="absolute w-full h-2 opacity-0 cursor-pointer"
                  style={{ zIndex: 1 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹{priceRange.min.toLocaleString()}</span>
                <span>₹{priceRange.max.toLocaleString()}</span>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!canSearch}
              className={`w-full px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all ${
                canSearch
                  ? 'bg-orange-500 text-white hover:bg-orange-600 transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Search Trips
            </button>
          </>
        ) : (
          <>
            {/* Search Results */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Modify Search
              </button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="rounded animate-pulse">
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
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="rounded transition snap-center w-[340px] cursor-pointer relative"
                    onClick={() => handlePackageClick(pkg)}
                  >
                    <div className="relative">
                      <BlurImage
                        src={import.meta.env.VITE_APP_API_URL ? `${import.meta.env.VITE_APP_API_URL}${pkg.images[0]}` : "/api/placeholder/340/340"}
                        alt={pkg.title}
                      />

                      {/* Coming Soon Overlay for Inactive Packages */}
                      {!pkg.isActive && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="bg-black bg-opacity-70 w-full h-full absolute rounded-lg flex items-center justify-center">
                            <div className="text-white text-2xl font-bold bg-orange-500 bg-opacity-90 px-6 py-3 rounded-lg transform rotate-[-10deg] shadow-lg">
                              Coming Soon
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sold Out Overlay when no seats available */}
                      {pkg.isActive && pkg.availableSeats === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="bg-black bg-opacity-70 w-full h-full absolute rounded-lg flex items-center justify-center">
                            <div className="text-white text-2xl font-bold bg-red-600 bg-opacity-90 px-6 py-3 rounded-lg transform rotate-[-10deg] shadow-lg">
                              Sold Out
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`bg-white rounded-b p-4 w-[340px] ${!isPackageAvailable(pkg) ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">{pkg.duration}</p>

                        <div className="flex items-center space-x-1 text-green-600 text-xs">
                          <span className="text-gray-400">Available Seats</span>
                          <span>{pkg.availableSeats}</span>
                        </div>
                      </div>

                      {/* Content Element 2: Title */}
                      <div className="content-element mb-2 h-14 overflow-hidden">
                        <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>
                      </div>

                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(pkg.startDate).toLocaleDateString()} - {" "}
                        {new Date(pkg.endDate).toLocaleDateString()}
                      </p>
                      
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
                        <div className="package_rating flex items-center content-end gap-2">
                          <span className="flex items-center text-[#f39c12] font-bold">
                            {(packageRatings[pkg._id]?.averageRating || 4.3).toFixed(1)}
                            <span className="flex ml-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </span>
                          </span>
                          <span className="text-gray-600 text-sm">
                            ({reviews[pkg._id]?.length || 20})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ₹{pkg.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{pkg.realPrice.toLocaleString()}
                          </span>
                          <span className="LeadForm_SavePrice_leftBorderICon h-[24px] ml-[5px]">
                            <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                            </svg>
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
                            <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                      
                      <div className="ProductCard_ButtonContainer flex flex-row justify-between mt-[10px]">
                        <a href="tel:+917542003073" className={`flex items-center h-[51px] w-[51px] border rounded-md border-solid border-[#f37002] text-[#f37002] hover:bg-[#f37002] hover:text-white justify-center text-[14px] font-semibold ${!isPackageAvailable(pkg) ? 'pointer-events-none opacity-70' : ''}`}>
                          <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                              <path d="M12.7538 10.1683L11.0772 9.9768C10.8801 9.95363 10.6802 9.97547 10.4927 10.0407C10.3052 10.1059 10.1349 10.2128 9.99464 10.3533L8.78006 11.5685C6.90617 10.615 5.38306 9.09099 4.43002 7.21606L5.6512 5.9942C5.93505 5.7102 6.07367 5.30732 6.02746 4.91104L5.83603 3.24667C5.80038 2.92436 5.64748 2.62643 5.40646 2.40963C5.16544 2.19283 4.85314 2.07232 4.52904 2.07104H3.38707C2.64116 2.07104 2.02067 2.69188 2.06688 3.43821C2.41673 9.07857 6.92519 13.5829 12.5558 13.933C13.3017 13.9792 13.9222 13.3584 13.9222 12.6121V11.4694C13.9288 10.809 13.4205 10.241 12.7538 10.1683Z" fill="var(--primary, #f37002)"></path>
                            </svg>
                          </div>
                        </a>
                        
                        <div className={`productCard_Button bg-[#f37002] text-white flex items-center justify-center h-[51px] border border-solid border-[#f37002] rounded-md text-[14px] font-semibold hover:bg-transparent hover:text-[#f37002] ${!isPackageAvailable(pkg) ? 'opacity-70 cursor-not-allowed' : ''}`}
                          style={{
                            width: 'calc(100% - 61px)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isPackageAvailable(pkg)) {
                              handleBooking(pkg._id);
                            }
                          }}
                        >
                          <span>
                            {!pkg.isActive ? "Coming Soon" :
                              pkg.availableSeats === 0 ? "Sold Out" : "Book Now"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No packages found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPopup