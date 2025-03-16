import React, { useEffect, useState, useRef } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RelatedPackages = ({ categoryId, currentPackageId }) => {
    const [relatedPackages, setRelatedPackages] = useState([]);
    const [visibleLeftButton, setVisibleLeftButton] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const navigate = useNavigate();
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchRelatedPackages = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/category/${categoryId}`
                );

                // ✅ Filter out the current package
                const filteredPackages = data.filter(pkg => pkg._id !== currentPackageId);

                setRelatedPackages(filteredPackages);
                
                // Check if content is scrollable after packages are loaded
                setTimeout(checkScrollable, 100);
            } catch (error) {
                console.error("Error fetching related packages:", error.message);
            }
        };

        if (categoryId) {
            fetchRelatedPackages();
        }
    }, [categoryId, currentPackageId]);

    // Check if carousel is scrollable
    const checkScrollable = () => {
        if (carouselRef.current) {
            const isContentScrollable = carouselRef.current.scrollWidth > carouselRef.current.clientWidth;
            setIsScrollable(isContentScrollable);
        }
    };

    useEffect(() => {
        // Add scroll event listener to track left button visibility
        const handleScroll = () => {
            if (carouselRef.current) {
                setVisibleLeftButton(carouselRef.current.scrollLeft > 10);
            }
        };

        const carouselElement = carouselRef.current;
        if (carouselElement) {
            carouselElement.addEventListener('scroll', handleScroll);
            // Check initial scrollability
            checkScrollable();
            
            // Also check on window resize
            window.addEventListener('resize', checkScrollable);
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('resize', checkScrollable);
        };
    }, [relatedPackages]);

    // ✅ Handle Carousel Scroll with improved smoothness
    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;

        const cardWidth = 340; // Width of a single card
        const gap = 16; // Gap between cards (taken from space-x-4)
        const scrollAmount = cardWidth + gap;
        
        const newScrollPosition = direction === "left"
            ? carouselRef.current.scrollLeft - scrollAmount
            : carouselRef.current.scrollLeft + scrollAmount;

        carouselRef.current.scrollTo({
            left: newScrollPosition,
            behavior: "smooth",
        });
    };

    if (relatedPackages.length === 0) return null; // ✅ Hide section if no related products

    return (
        <div className="max-w-[1440px] mx-auto p-0">
            <div className="rounded-xl p-1 relative">
                {/* Section Header */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 pb-2">
                    Related Packages
                </h2>

                {/* Left Scroll Button - only visible after scrolling */}
                {visibleLeftButton && (
                    <button
                        className="hidden md:block absolute left-[-20px] md:left-[-32px] top-[45%] transform -translate-y-1/2 z-10 bg-white border border-gray-500 p-3 rounded-full shadow hover:bg-gray-100 transition-opacity duration-300"
                        onClick={() => scrollCarousel('left')}
                        aria-label="Scroll left"
                    >
                        <FaChevronLeft size={16} />
                    </button>
                )}

                {/* Packages Carousel with snap-type for smooth sliding */}
                <div 
                    ref={carouselRef} 
                    className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {relatedPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="rounded transition snap-center cursor-pointer flex-shrink-0 w-[295px] md:w-[340px]"
                            onClick={() => navigate(`/package/${pkg._id}`)}
                        >
                            {/* Package Image */}
                            <div className="overflow-hidden rounded-t relative w-[295px] md:w-[340px] h-[340px]">
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

                            {/* Package Details */}
                            <div className="bg-white rounded-b p-[0.5rem] w-[295px] md:w-[340px]">
                                <p className="text-sm text-gray-500">{pkg.duration}</p>
                                <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>

                                {/* Pricing */}
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
                                                {pkg.duration.split(" ")[0]}
                                            </span>
                                            <span className="flex items-center text-xs font-normal text-[#515151] w-max">
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

                                {/* View Details Button */}
                                <button className="mt-3 w-full py-2 bg-transparent text-[#f37002] border border-[#f37002] rounded-md font-semibold hover:bg-[#f37002] hover:text-white transition">
                                    View Package
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button - always visible if content is scrollable */}
                {isScrollable && (
                    <button
                        className="hidden md:block absolute right-[-20px] md:right-[-32px] top-[45%] transform -translate-y-1/2 z-10 bg-white border border-gray-500 p-3 rounded-full shadow hover:bg-gray-100 transition"
                        onClick={() => scrollCarousel('right')}
                        aria-label="Scroll right"
                    >
                        <FaChevronRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default RelatedPackages;