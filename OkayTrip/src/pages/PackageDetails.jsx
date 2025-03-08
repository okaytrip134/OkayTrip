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
import { FaAngleDown, FaAngleUp, FaChevronCircleLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RelatedPackages from "../components/RelatedPackages";
import ReviewsSection from "../components/ReviewsSections";


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
  const userToken = localStorage.getItem("userToken");

  const handleBooking = () => {
    if (!userToken) {
      setShowAuthPopup(true);
    }
    else {
      navigate(`/booking/${packageData._id}`);
    }
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

    fetchPackageDetails();
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

  return (
    <div className=" lg:px-16 py-8 min-h-screen max-w-[1400px] mx-auto">
      {/* Main Content */}
      <div className="bg-white rounded p-6 mb-8">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
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
            {loading
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
        {/* BODY CONTAINER */}

        <div className="TourPackage_body grid md:grid-cols-[64%_auto] sm:grid-cols-[100%]"
          style={{
            marginTop: "30px",
            gap: "20px",
            overflow: 'hidden'
          }}
        >
          {/* Right Section */}
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
                  minWidth: "270px",
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
                  <div className="pricing_left_section"
                    style={{
                    }}
                  >
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
                    <div className="package_seat flex gap-[5px] items-center cursor-pointer font-semibold text-black">
                      Avilable Seat :
                      <span className="text-[#515151] font-bold">{packageData.availableSeats}</span>
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
              {/*Lead Form */}
              <div className="StickyForm_package shadow-sm"
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
                <div className="productEnquiryform_wrapper px-[5px] py-[15px] border border-[#b3afaf] rounded-lg mt-[10px] max-w-[290px] md:max-w-[360px] min-w-[240px]">
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
                      <span className="LeadForm_SavePrice_leftBorderICon h-[24px] ml-[5px]"><svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path></svg>
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
                        <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path></svg>
                      </span>
                    </div>
                  </div>

                  {/* Enquiry Form */}
                  <div className="p-4">
                    <form className="flex flex-col space-y-3">
                      <input
                        type="text"
                        placeholder="Full Name*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />

                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />

                      {/* Phone Input */}
                      <div className="flex space-x-2">
                        <select className="w-1/3 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                          <option value="+91">+91</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Your Phone*"
                          className="w-2/3 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
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
                        />
                        <input
                          type="number"
                          placeholder="Traveller Count*"
                          className="w-1/2 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        />
                      </div>

                      <textarea
                        placeholder="Message..."
                        rows="3"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                      ></textarea>

                      {/* Enquiry Button */}
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
          <div className="TourPackage_body_left">
            <div className="TourPackage_body_left_title">
              {/* Title and Details */}
              <h1 className="title_package text-[1.2rem] md:text-[1.5rem]"
                style={{
                  fontWeight: "700",
                  lineHeight: "45px",
                  color: "#000",
                }}
              >{loading ? <Skeleton width={300} /> : packageData.title}</h1>
              <p className="text-gray-600 mt-2">{loading ? <Skeleton count={3} /> : packageData.description}</p>
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
              {/* Package Hightlights */}
              {packageData.tripHighlights && packageData.tripHighlights.length > 0 && (
                <div className="PackageHighlights">
                  {/* Heading with Icon */}
                  <h2 className="flex items-center text-[#202020] text-2xl font-bold mb-4">
                    Trip Highlights
                  </h2>

                  {/* Highlights List */}
                  <ul className="space-y-3 pl-1">
                    {packageData.tripHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start text-gray-700 text-lg">
                        <span className="mr-2 text-green-500">✔</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="LineDivider_tourPackageDivider my-8 mx-0 w-[95%] h-[1px] border-t-[1px] border-t-[#e0e0e0]"></div>

              {/* Itinerary */}
              {/* Itinerary */}
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4">Itinerary</h3>
                  {/* Image Slider (Before Itinerary) */}
                  <div className="relative">
                    <Carousel
                      showArrows={true}
                      showThumbs={false}
                      showStatus={false}
                      infiniteLoop
                      useKeyboardArrows
                      autoPlay
                      interval={5000}
                      selectedItem={currentSlide}
                      onChange={(index) => setCurrentSlide(index)}
                    >
                      {packageData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                            alt={`Package Image ${index}`}
                            className="w-full h-[400px] object-cover rounded-lg"
                          />

                          {/* Slide Number */}
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {index + 1}/{packageData.images.length}
                          </div>
                        </div>
                      ))}
                    </Carousel>
                    {/* Small Thumbnail View */}
                    <div className="absolute bottom-3 left-3 flex space-x-2">
                      {packageData.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={`${import.meta.env.VITE_APP_API_URL}${image}`}
                          alt={`Thumbnail ${index}`}
                          className="w-10 h-10 object-cover rounded-full border-2 border-white cursor-pointer"
                          onClick={() => setShowImageGallery(true)}
                        />
                      ))}
                      {packageData.images.length > 4 && (
                        <div
                          className="w-10 h-10 flex items-center justify-center bg-white text-gray-800 text-sm font-bold border-2 border-white rounded-full cursor-pointer"
                          onClick={() => setShowImageGallery(true)}
                        >
                          +{packageData.images.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => toggleDropdown(index)}
                        >
                          {/* Updated Layout */}
                          <div className="flex  items-center gap-3">
                            {/* Day Label - Now as a flex-shrink-0 to prevent wrapping */}
                            <span className="flex-shrink-0 bg-[#BF500E] text-white text-sm font-semibold px-3 py-1 rounded-full">
                              DAY {index + 1}
                            </span>

                            {/* Title - Now with flex-grow and proper truncation on mobile */}
                            <div className="flex-grow flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-gray-800 pr-2">{day.title}</h4>

                              {/* Dropdown Icon - Moved to ensure it stays at the end */}
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
          <div className="TourPackage_body_right hidden md:block ">
            <div className="tour_packageright_wrapper"
              style={{
                display: 'flex',
                flexDirection: "column",
                gap: "20px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {/* Pricing */}
              <div className="pricing_card"
                style={{
                  padding: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  minWidth: "360px",
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
                  <div className="pricing_left_section"
                    style={{
                    }}
                  >
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
                    <div className="package_seat flex gap-[5px] items-center cursor-pointer font-semibold text-black">
                      Avilable Seat :
                      <span className="text-[#515151] font-bold">{packageData.availableSeats}</span>
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
              {/*Lead Form */}
              <div className="StickyForm_package shadow-sm"
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
                <div className="productEnquiryform_wrapper px-[5px] py-[15px] border border-[#e0e0e0] rounded-lg mt-[10px] max-w-[390px] min-w-[340px] min-h-[500px]">
                  <div className="LeadForm_infoBOx"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '0 10px',
                      maxWidth: 'calc(100vw - 100ppx)',
                      height: '45px'
                    }}
                  >
                    <div className="LeadFormProductName text-[#515151] text-[14px] font-bold"
                      style={{
                        lineHeight: '19px',
                        textTransform: 'capitalize',
                        display: 'flex',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {packageData.title}
                    </div>
                    <div className="LeadForm_priceWrapper flex flex-row gap-0 items-center mt-1">
                      <div className="package_actual_price"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '15px',
                          fontWeight: 600,
                          lineHeight: '23px',
                          marginRight: '5px',
                          color: '#202020'
                        }}
                      >
                        ₹ {packageData.discountedPrice}
                      </div>
                      <div className="package_dicounted_price line-through"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '12px',
                          fontWeight: '300',
                          lineHeight: '18px',
                          color: '#515151',
                        }}
                      >
                        ₹ {packageData.realPrice}
                      </div>
                      <span className="LeadForm_SavePrice_leftBorderICon h-[24px] ml-[5px]"><svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path></svg>
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
                        <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.65992 3L0 6L2.65992 9L0 12L2.65992 15L0 18L2.65992 21L0 24H3.5V0H0L2.65992 3Z" fill="#E5F1E8"></path></svg>
                      </span>
                    </div>
                  </div>
                  {/* Lead Form structure */}
                  <div className="max-w-full mx-auto p-4">
                    <form className="flex flex-col space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />

                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />

                      {/* Phone Input */}
                      <div className="flex space-x-2">
                        <select className="w-1/3 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                          <option value="+91">+91</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Your Phone*"
                          className="w-2/3 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
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
                        />
                        <input
                          type="number"
                          placeholder="Traveller Count*"
                          className="w-1/2 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        />
                      </div>

                      <textarea
                        placeholder="Message..."
                        rows="3"
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
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
        <div className="max-w-[1440px] mx-auto my-0 p-6">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="w-[80%] bg-white overflow-y-auto p-6">
              <button
                onClick={() => setShowImageGallery(false)}
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
