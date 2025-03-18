import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import endImage from '../assets/end_of_trip_desktop.avif';
import mobiileEndImage from '../assets/end_of_trip_mobile.avif'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import UserAuth from "../components/UserAuth";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaAngleDown, FaChevronCircleLeft, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import RelatedPackages from "../components/RelatedPackages";
import ReviewsSection from "../components/ReviewsSections";
// import { FaStar, FaRegStar, FaCamera } from "react-icons/fa";  


const PackageDetailsPage = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [openIndex, setOpenIndex] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [galleryClosing, setGalleryClosing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travellerCount, setTravellerCount] = useState("");
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });
  const formRef = useRef(null);
  // const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem("userToken");
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    fetchReviews();
    // fetchAverageRating();
  }, [packageId]);
  const getTotalReviewCount = () => {
    return Object.values(ratingStats).reduce((sum, count) => sum + count, 0);
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/reviews/${packageId}`);

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      console.log("Fetched Reviews:", data); // ✅ Check if adminResponse is included
      setReviews(data.reviews);
      // Calculate rating statistics
      const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          stats[review.rating]++;
        }
      });
      setRatingStats(stats);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!userToken) {
      setShowAuthPopup(true);
    }
    else {
      navigate(`/booking/${packageData._id}`);
    }
  };
  const closeGallery = () => {
    setGalleryClosing(true);
    setTimeout(() => {
      setShowImageGallery(false);
      setGalleryClosing(false);
    }, 300);
  };


  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const { data } = await axios.get(
          ` ${import.meta.env.VITE_APP_API_URL}/api/admin/packages/details/${packageId}`
        );
        setPackageData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching package details:", error.message);
        setLoading(false);
      }
    };
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/reviews/${packageId}/rating`
        );
        if (!response.ok) throw new Error("Failed to fetch average rating");

        const data = await response.json();
        setAverageRating(data.averageRating || 4.5);
        setTotalReviews(data.totalReviews || 20);
      } catch (error) {
        console.error("Error fetching average rating:", error);
        setAverageRating(0);
        setTotalReviews(0);
      }
    };
    fetchPackageDetails();
    fetchAverageRating();
  }, [packageId]);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <div className="text-center py-10">Loading package details...</div>;
  }

  if (!packageData) {
    return <div className="text-center py-10">Package not found.</div>;
  }
  // lead form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      packageId: packageData._id,
      packageTitle: packageData.title, // 🟢 Send package title
      fullName,
      email,
      phone,
      travelDate,
      travellerCount,
      message,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/leads/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Enquiry submitted successfully!");
      } else {
        alert(data.error || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Something went wrong.");
    }
  };



  return (
    <div className=" lg:px-16 py-8 min-h-screen max-w-[1400px] mx-auto">
      {/* Main Content */}
      <div className="bg-white rounded p-2 md:p-6 mb-8">
        {/* Images */}
        <div className="mb-6">
          {/* Desktop view (hidden on mobile) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                {loading ? (
                  <Skeleton height={400} />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL}${packageData.images[0]}`}
                    alt={packageData.title}
                    className="w-full h-[400px] object-cover"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {
                  loading
                    ? Array(4)
                      .fill()
                      .map((_, index) => <Skeleton key={index} height={160} />)
                    : packageData.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                          alt={`Thumbnail ${index}`}
                          className="w-full h-[10rem] object-cover cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <span className="text-white text-sm font-medium">View</span>
                        </div>
                      </div>
                    ))}
                {!loading && packageData.images.length > 5 && (
                  <button
                    onClick={() => setShowImageGallery(true)}
                    className="col-span-2 bg-[#f37002] rounded-md font-mono font-semibold text-white hover:text-[#f37002] py-2 border border-[#f37002] text-center shadow hover:bg-transparent"
                  >
                    View All Images
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile view (only visible on mobile) - with smooth transitions and limited thumbnails */}
          <div className="block md:hidden">
            {loading ? (
              <Skeleton height={400} />
            ) : (
              <div className="relative">
                {/* Main large image (current active slide) with smooth transition */}
                <div className="relative overflow-hidden h-[400px]">
                  <div
                    className="flex transition-transform duration-300 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {packageData.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                        alt={`Slide ${index}`}
                        className="w-full h-full object-cover flex-shrink-0"
                        onClick={() => setShowImageGallery(true)}
                      />
                    ))}
                  </div>
                </div>

                {/* Indicator dashes */}
                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
                  {packageData.images.slice(0, 3).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 w-6 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>

                {/* Circular thumbnails with +number indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {packageData.images.slice(0, 3).map((image, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 ${currentSlide === index ? 'border-[#f37002]' : 'border-white'}`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <img
                        src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Plus indicator for remaining images */}
                  {packageData.images.length > 3 && (
                    <div
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-black/50 flex items-center justify-center text-white font-bold"
                      onClick={() => setShowImageGallery(true)}
                    >
                      +{packageData.images.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* BODY CONTAINER */}

        <div className="TourPackage_body grid md:grid-cols-[64%_auto] sm:grid-cols-[100%]"
          style={{
            marginTop: "30px",
            gap: "20px",
            overflow: 'hidden'
          }}
        >
          {/*Mobbile Section */}
          <div className="TourPackage_body_upper sm:block md:hidden">
            <div className="tour_packageright_wrapper"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <div className="pricing_card"
                style={{
                  padding: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  // minWidth: "360px",
                }}
              >
                <div className="pricing_top"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <div className="pricing_left_section">
                    <div className="undefined">
                      <div className="productpricing_currentprice"
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "5px",
                        }}
                      >
                        <div className="package_actual_price"
                          style={{
                            fontSize: '22px',
                            fontWeight: 600,
                            lineHeight: '38px',
                            color: '#202020'
                          }}
                        >
                          ₹ {packageData.discountedPrice}
                        </div>
                      </div>
                      <div className="package_dicounted_price line-through"
                        style={{
                          fontSize: '18px',
                          lineHeight: '27px',
                          color: '#515151',
                        }}
                      >
                        ₹ {packageData.realPrice}
                      </div>
                    </div>
                  </div>
                  <div className="package_pricing_rightsection relative">
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="text-lg font-semibold">Available Seats: {packageData.availableSeats}</div>
                      {averageRating !== null ? (
                        <div className="package_rating flex items-center justify-end gap-2">
                          {/* <span className="text-black font-semibold">Rating:</span> */}
                          <span className="flex items-center text-[#f39c12] font-bold">
                            {averageRating.toFixed(1)}
                            <span className="flex ml-1">
                              <FaStar
                                size={16}
                              />

                            </span>
                          </span>
                          <span className="text-gray-600 text-sm">({getTotalReviewCount()})</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">4.5 (<FaStar size={16} />)</div>
                      )}
                    </div>
                    <div className="packagepricing_dealwrapper"
                      style={{
                        minWidth: 'max-content',
                        position: 'absolute',
                        bottom: '0',
                        right: '-15px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        transform: 'scale(0.85)'
                      }}
                    >
                    </div>
                  </div>
                </div>
                <div className="pricing_bottom border-t border-[#e0e0e0] pt-4">
                  <button className="Booking_button hover:bg-transparent hover:text-[#f37002] bg-[#f37002] text-white"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '51px',
                      borderRadius: '7px',
                      border: '1px solid #f37002',
                      fontSize: '20px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={handleBooking}
                  >
                    <span>Book Now</span>
                  </button>
                </div>
              </div>

              {/* Mobile Lead Form - Slide Up Animation */}
              <div
                ref={formRef}
                className={`StickyForm_package shadow-lg fixed left-0 right-0 bottom-0 w-full max-h-[90vh] overflow-auto bg-white rounded-t-2xl transition-transform duration-300 ease-in-out z-50 ${isFormVisible ? 'translate-y-0' : 'translate-y-full'}`}
              >
                <div className="relative p-4">
                  {/* Close button */}
                  <button
                    onClick={toggleForm}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </button>

                  {/* Handle/Drag indicator */}
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

                  <div className="productEnquiryform_wrapper px-[5px] py-[15px] border border-[#b3afaf] rounded-lg max-w-full mx-auto">
                    <div className="LeadForm_infoBOx px-3">
                      <div className="LeadFormProductName text-[#515151] text-[12px] font-bold truncate">
                        {packageData.title}
                      </div>

                      {/* Price Section */}
                      <div className="LeadForm_priceWrapper flex items-center mt-2">
                        <div className="package_actual_price font-semibold text-[16px] text-gray-900 mr-2">
                          ₹ {packageData.discountedPrice}
                        </div>
                        <div className="package_dicounted_price line-through text-[12px] text-gray-500">
                          ₹ {packageData.realPrice}
                        </div>

                        {/* Save Price Tag */}
                        <span className="LeadForm_SavePrice_leftBorderICon h-[24px] ml-[5px]">
                          <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                          </svg>
                        </span>
                        {packageData.realPrice > packageData.discountedPrice && (
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
                            Save ₹{(packageData.realPrice - packageData.discountedPrice).toLocaleString()}
                          </span>
                        )}
                        <span className="LeadForm_savePrice_RightBorderIcon"
                          style={{
                            transform: 'rotate(180deg)',
                            height: '24px'
                          }}
                        >
                          <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Enquiry Form */}
                    <div className="p-4">
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        placeholder="Full Name*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />

                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {/* Phone Input */}
                      <div className="flex space-x-2">
                        <select className="w-1/4 px-2 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                          <option value="+91">+91</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Your Phone*"
                          className="w-3/4 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      {/* Travel Date & Traveller Count */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Travel Date*"
                          onFocus={(e) => (e.target.type = 'date')}
                          onBlur={(e) => (e.target.type = 'text')}
                          className="w-1/2 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Traveller Count*"
                          className="w-1/2 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                          value={travellerCount}
                          onChange={(e) => setTravellerCount(e.target.value)}
                        />
                      </div>

                      <textarea
                        placeholder="Message..."
                        rows="3"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>

                      <button className="Booking_button bg-transparent text-[#f37002] hover:bg-[#f37002] hover:text-white"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          height: '51px',
                          borderRadius: '7px',
                          border: '1px solid #f37002',
                          fontSize: '20px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <span>Enquiry Now</span>
                      </button>
                    </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Send Enquiry button at bottom */}
            {!isFormVisible && (
              <div className="fixed bottom-0 left-0 right-0 mx-auto w-[100%] max-w-md bg-white p-6 shadow-xl z-40">
                <button
                  onClick={toggleForm}
                  className="w-full bg-[#f37002] text-white py-3 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                  </svg>
                  <span>Send Enquiry</span>
                </button>
              </div>
            )}
          </div>
          <div className="TourPackage_body_left">
            <div className="TourPackage_body_left_title">
              {/* Title and Details */}
              <h1 className="title_package text-[1rem] md:text-[1.5rem]"
                style={{
                  fontWeight: "700",
                  lineHeight: "45px",
                  color: "#515151",
                }}
              >{loading ? <Skeleton width={300} /> : packageData.title}</h1>
              <p className="text-gray-600 mt-2 text-[12px] md:text-[16px]">{loading ? <Skeleton count={3} /> : packageData.description}</p>
              <div className="package_duration"
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >
                <div className="trip_duration"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 8px",
                    width: "auto",
                    height: "27px",
                    borderRadius: "20px",
                    backgroundColor: "#bf500e",
                    marginTop: "9px",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  {packageData.duration.toUpperCase()}
                </div>
                <div className="DestinnationInfo_destinationInfoWrapper flex gap-[10px] flex-wrap">
                  <div className="DestinationInfoItem flex items-center gap-2 flex-row">
                    {/* Number of Days */}
                    <div
                      className="DestinationInfo_noOfDays"
                      style={{
                        fontSize: "31px",
                        fontWeight: "700",
                        lineHeight: "47px",
                        color: "#cbcbcb",
                      }}
                    >
                      {packageData.duration.split(" ")[0]}
                    </div>

                    {/* Text Section */}
                    <div
                      className="DestinationInfo_rightsectionText flex flex-col justify-center"
                      style={{
                        display: "flex",
                        alignItems: "start",
                      }}
                    >
                      <div
                        className="DestinationInfoStaticText"
                        style={{
                          fontSize: "9px",
                          fontWeight: "400",
                          lineHeight: "14px",
                        }}
                      >
                        Days in
                      </div>
                      <div
                        className="DestinationInfodestinationName"
                        style={{
                          fontSize: "11px",
                          fontWeight: "500",
                          lineHeight: "17px",
                          color: "#202020",
                        }}
                      >
                        {packageData.categoryId?.name || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="LineDivider_tourPackageDivider my-8 mx-0 w-[95%] h-[1px] border-t-[1px] border-t-[#e0e0e0]"></div>
              {/* Package Highlights */}
              {packageData.tripHighlights && packageData.tripHighlights.length > 0 && (
                <div className="bg-white rounded-lg my-6">
                  {/* Heading with Icon */}
                  <h2 className="flex items-center text-[#515151] text-xl md:text-2xl font-bold mb-4">
                    Trip Highlights
                  </h2>

                  {/* Highlights List */}
                  <ul className="grid grid-cols-1 gap-3 text-sm md:text-base">
                    {packageData.tripHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start p-2 hover:bg-gray-50 rounded-md transition-colors">
                        <span className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="LineDivider_tourPackageDivider my-8 mx-0 w-[95%] h-[1px] border-t-[1px] border-t-[#e0e0e0]"></div>

              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4">Itinerary</h3>

                  {/* Image Slider with Fixed Overlay Elements */}
                  <div className="relative mb-6 rounded-lg overflow-hidden">
                    {/* Carousel Component */}
                    <Carousel
                      showArrows={false} // We'll create custom arrows outside the carousel
                      showThumbs={false}
                      showStatus={false}
                      infiniteLoop
                      useKeyboardArrows
                      autoPlay
                      interval={5000}
                      selectedItem={currentSlide}
                      onChange={(index) => setCurrentSlide(index)}
                      renderIndicator={(onClickHandler, isSelected, index) => {
                        return (
                          <button
                            type="button"
                            onClick={onClickHandler}
                            key={index}
                            tabIndex={0}
                            className={`hidden md:inline-block h-2 w-2 mx-1 rounded-full ${isSelected ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            style={{ margin: '0 4px' }}
                          />
                        );
                      }}
                    >
                      {packageData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                            alt={`Package Image ${index}`}
                            className="w-full h-[400px] object-cover"
                          />
                        </div>
                      ))}
                    </Carousel>

                    {/* Fixed Left Arrow - Outside carousel */}
                    <button
                      type="button"
                      onClick={() => {
                        const prevSlide = currentSlide === 0 ? packageData.images.length - 1 : currentSlide - 1;
                        setCurrentSlide(prevSlide);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-0 bg-white bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                    >
                      <FaChevronLeft className="text-gray-800" size={20} />
                    </button>

                    {/* Fixed Right Arrow - Outside carousel */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextSlide = currentSlide === packageData.images.length - 1 ? 0 : currentSlide + 1;
                        setCurrentSlide(nextSlide);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-0 bg-white bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                    >
                      <FaChevronRight className="text-gray-800" size={20} />
                    </button>

                    {/* Fixed Slide Counter - Bottom center */}
                    <div className="absolute bottom-6 left-0 right-0 z-0 hidden md:block">
                      <div className="flex justify-center">
                        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentSlide + 1}/{packageData.images.length}
                        </div>
                      </div>
                    </div>

                    {/* Fixed Left Content - Bottom left */}
                    <div className="absolute bottom-5 left-6 z-0 text-white">
                      <div className="DestinnationInfo_destinationInfoWrapper flex gap-[10px] flex-wrap">
                        <div className="DestinationInfoItem flex items-center gap-2 flex-row">
                          {/* Number of Days */}
                          <div
                            className="DestinationInfo_noOfDays text-[30px] md:text-[45px]"
                            style={{
                              // fontSize: "45px",
                              fontWeight: "700",
                              lineHeight: "47px",
                              color: "#cbcbcb",
                            }}
                          >
                            {packageData.duration.split(" ")[0]}
                          </div>

                          {/* Text Section */}
                          <div
                            className="DestinationInfo_rightsectionText flex flex-col justify-center"
                            style={{
                              display: "flex",
                              alignItems: "start",
                            }}
                          >
                            <div
                              className="DestinationInfoStaticText"
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                lineHeight: "14px",
                                marginLeft: '2px'
                              }}
                            >
                              Days in
                            </div>
                            <div
                              className="DestinationInfodestinationName "
                              style={{
                                fontSize: "30px",
                                fontWeight: "700",
                                lineHeight: "26px",
                                color: "#fff",
                              }}
                            >
                              {packageData.categoryId?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Right Content - Bottom right */}
                    <div className="absolute bottom-5 right-6 z-20 flex space-x-2">
                      {packageData.images.slice(0, window.innerWidth < 768 ? 1 : 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={`${import.meta.env.VITE_APP_API_URL}${img}`}
                          alt={`Thumbnail ${idx}`}
                          className="w-10 h-10 object-cover rounded-full border-2 border-white cursor-pointer"
                          onClick={() => setShowImageGallery(true)}
                        />
                      ))}
                      {packageData.images.length > 3 && (
                        <div
                          className="w-10 h-10 flex items-center justify-center bg-white text-gray-800 text-sm font-bold border-2 border-white rounded-full cursor-pointer"
                          onClick={() => setShowImageGallery(true)}
                        >
                          +{packageData.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Itinerary Items */}
                  <div className="space-y-4">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => toggleDropdown(index)}
                        >
                          {/* Updated Layout for Title and Day */}
                          <div className="flex items-center gap-3">
                            {/* Day Label - Now as a flex-shrink-0 to prevent wrapping */}
                            <span className="flex-shrink-0 bg-[#BF500E] text-white text-sm font-semibold px-3 py-1 rounded-full">
                              DAY {index + 1}
                            </span>

                            {/* Title - Now with flex-grow and truncation on mobile */}
                            <div className="flex-grow flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-gray-800 pr-4 line-clamp-1 md:line-clamp-none">
                                {day.title}
                              </h4>

                              {/* Dropdown Icon - Fixed position */}
                              <span className={`flex-shrink-0 text-gray-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`}>
                                <FaAngleDown />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Conditional Description Rendering */}
                        {openIndex === index && (
                          <>
                            <div className="my-4 mx-4 h-px bg-gray-200"></div>
                            {/* Show full title if it was truncated */}
                            {day.title.length > 30 && (
                              <div className="px-4 pt-2">
                                <h4 className="font-semibold text-gray-800">{day.title}</h4>
                              </div>
                            )}
                            <div className="p-4 rounded-lg text-gray-600">
                              <p>{day.description}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          {/* Right Section */}
          <div className="TourPackage_body_right hidden md:block">
            <div className="tour_packageright_wrapper"
              style={{
                display: 'flex',
                flexDirection: "column",
                gap: "20px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {/* Pricing */}
              <div className="pricing_card w-full"
                style={{
                  padding: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                <div className="pricing_top"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div className="pricing_left_section">
                    <div>
                      <div className="productpricing_currentprice"
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "5px",
                        }}
                      >
                        <div className="package_actual_price"
                          style={{
                            fontSize: '22px',
                            fontWeight: 600,
                            lineHeight: '38px',
                            color: '#202020'
                          }}
                        >
                          ₹ {packageData.discountedPrice}
                        </div>
                      </div>
                      <div className="package_dicounted_price line-through"
                        style={{
                          fontSize: '18px',
                          lineHeight: '27px',
                          color: '#515151',
                        }}
                      >
                        ₹ {packageData.realPrice}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-lg font-semibold">Available Seats: {packageData.availableSeats}</div>
                    {averageRating !== null ? (
                      <div className="package_rating flex items-center justify-end gap-2">
                        {/* <span className="text-black font-semibold">Rating:</span> */}
                        <span className="flex items-center text-[#f39c12] font-bold">
                          {averageRating.toFixed(1)}
                          <span className="flex ml-1">
                            <FaStar
                              size={16}
                            />

                          </span>
                        </span>
                        <span className="text-gray-600 text-sm">({getTotalReviewCount()})</span>
                      </div>
                    ) : (
                      <div className="text-gray-500">4.5 (<FaStar size={16} />)</div>
                    )}
                  </div>

                </div>
                <div className="pricing_bottom border-t border-[#e0e0e0] pt-4">
                  <button className="Booking_button hover:bg-transparent hover:text-[#f37002] bg-[#f37002] text-white"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '51px',
                      borderRadius: '7px',
                      border: '1px solid #f37002',
                      fontSize: '20px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={handleBooking}
                  >
                    <span>Book Now</span>
                  </button>
                </div>
              </div>

              {/*Lead Form */}
              <div className="StickyForm_package shadow-sm w-full"
                style={{
                  position: 'sticky',
                  top: '10px',
                  zIndex: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: "all 0.3s ease-in-out"
                }}
              >
                <div className="productEnquiryform_wrapper px-[5px] py-[15px] border border-[#e0e0e0] rounded-lg mt-[10px] w-full">
                  <div className="LeadForm_infoBOx px-3">
                    <div className="LeadFormProductName text-[#515151] text-[14px] font-bold truncate">
                      {packageData.title}
                    </div>

                    <div className="LeadForm_priceWrapper flex flex-wrap items-center mt-1">
                      <div className="package_actual_price font-semibold text-[15px] text-gray-900 mr-2">
                        ₹ {packageData.discountedPrice}
                      </div>
                      <div className="package_dicounted_price line-through text-[12px] text-gray-500 mr-2">
                        ₹ {packageData.realPrice}
                      </div>

                      {packageData.realPrice > packageData.discountedPrice && (
                        <div className="flex items-center">
                          <span className="LeadForm_SavePrice_leftBorderICon h-[24px]">
                            <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                            </svg>
                          </span>
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
                            }}
                          >
                            Save ₹{(packageData.realPrice - packageData.discountedPrice).toLocaleString()}
                          </span>
                          <span className="LeadForm_savePrice_RightBorderIcon"
                            style={{
                              transform: 'rotate(180deg)',
                              height: '24px'
                            }}
                          >
                            <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path>
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lead Form structure */}
                  <div className="w-full mx-auto p-4">
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        placeholder="Full Name*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />

                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {/* Phone Input */}
                      <div className="flex space-x-2">
                        <select className="w-1/4 px-2 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                          <option value="+91">+91</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Your Phone*"
                          className="w-3/4 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      {/* Travel Date & Traveller Count */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Travel Date*"
                          onFocus={(e) => (e.target.type = 'date')}
                          onBlur={(e) => (e.target.type = 'text')}
                          className="w-1/2 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Traveller Count*"
                          className="w-1/2 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                          value={travellerCount}
                          onChange={(e) => setTravellerCount(e.target.value)}
                        />
                      </div>

                      <textarea
                        placeholder="Message..."
                        rows="3"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>

                      <button className="Booking_button bg-transparent text-[#f37002] hover:bg-[#f37002] hover:text-white"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          height: '51px',
                          borderRadius: '7px',
                          border: '1px solid #f37002',
                          fontSize: '20px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <span>Enquiry Now</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="TourPackage_endOfTripContainer container flex items-center mt-5">
          <img src={endImage} loading="lazy" alt="" className="w-full h-full hidden md:block " />
          <img src={mobiileEndImage} loading="lazy" alt="" className="w-full h-full block md:hidden" />
        </div>

        {/* Exclusion Inclusion */}
        <div className="max-w-[1440px] mx-auto my-0 p-0 md:p-6">
          <div className="rounded-xl border border-gray-200 p-0 md:p-6">
            {/* ✅ Section Header */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 border-b-[1px]">
              What's Inside the Package?
            </h2>

            <div className="flex flex-col sm:flex-row w-full gap-6">
              {/* ✅ Inclusions Section */}
              <div className="flex-1 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700 mb-4">✅ Inclusions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {packageData.inclusions.map((inclusion, index) => (
                    <li key={index} className="text-gray-700 hover:text-green-800 transition duration-300">
                      {inclusion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ✅ Divider */}
              <div className="hidden sm:block w-[1px] bg-gray-300 rounded"></div>

              {/* ✅ Exclusions Section */}
              <div className="flex-1 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-4">❌ Exclusions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {packageData.exclusions.map((exclusion, index) => (
                    <li key={index} className="text-gray-700 hover:text-red-800 transition duration-300">
                      {exclusion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="LineDivider_tourPackageDivider my-8 mx-0 w-[95%] h-[1px] border-t-[1px] border-t-[#e0e0e0]"></div>
        <RelatedPackages categoryId={packageData.categoryId?._id} currentPackageId={packageData._id} />
        <div className="LineDivider_tourPackageDivider my-8 mx-0 w-[95%] h-[1px] border-t-[1px] border-t-[#e0e0e0]"></div>
        <ReviewsSection packageId={packageData._id} />
      </div>

      {/* Image Gallery */}
      {
        showImageGallery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex transition-opacity duration-300 ease-in-out">
            <div
              className="w-full md:w-[80%] bg-white overflow-y-auto p-6"
              style={{
                animation: galleryClosing
                  ? 'slideOutToLeft 1s ease-in-out forwards'
                  : 'slideInFromLeft 1s ease-out'
              }}
            >
              <button
                onClick={closeGallery}
                className="mb-4 text-lg text-black hover:text-gray-800"
              >
                ← Back
              </button>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {packageData.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                    alt={`Gallery Image ${index}`}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => setLightboxIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      }

      {/* Show Authentication Popup */}
      {showAuthPopup && <UserAuth onClose={() => setShowAuthPopup(false)} />}
      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{ width: 120, height: 80 }}
        slides={packageData.images.map((image) => ({
          src: `${import.meta.env.VITE_APP_API_URL}${image}`,
        }))}
      />
    </div >
  );
};

export default PackageDetailsPage;
