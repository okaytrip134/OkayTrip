import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import explore from "../assets/svg/explore.svg";

const HorizontalMenu = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("explore");
  const menuRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [slideDirection, setSlideDirection] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/categories/`)
        setCategories(data.filter((category) => category.isActive));
        setActiveCategory("explore");
        setTimeout(updateScrollStatus, 0);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (!menuRef.current) return;
    
    const visibleItems = getVisibleItems();
    const firstVisibleIndex = visibleItems[0];
    
    // Animate items that will come into view
    const newAnimatingItems = new Set([...animatingItems]);
    for (let i = Math.max(0, firstVisibleIndex - 3); i < firstVisibleIndex; i++) {
      newAnimatingItems.add(i);
    }
    setAnimatingItems(newAnimatingItems);
    setSlideDirection("left");
    
    menuRef.current.scrollBy({ left: -200, behavior: "smooth" });
    
    // Clear animation classes after transition
    setTimeout(() => {
      setAnimatingItems(new Set());
      setSlideDirection(null);
    }, 500);
  };

  const scrollRight = () => {
    if (!menuRef.current) return;
    
    const visibleItems = getVisibleItems();
    const lastVisibleIndex = visibleItems[visibleItems.length - 1];
    
    // Animate items that will come into view
    const newAnimatingItems = new Set([...animatingItems]);
    const totalItems = categories.length + 1; // +1 for explore
    for (let i = lastVisibleIndex + 1; i < Math.min(totalItems, lastVisibleIndex + 4); i++) {
      newAnimatingItems.add(i);
    }
    setAnimatingItems(newAnimatingItems);
    setSlideDirection("right");
    
    menuRef.current.scrollBy({ left: 200, behavior: "smooth" });
    
    // Clear animation classes after transition
    setTimeout(() => {
      setAnimatingItems(new Set());
      setSlideDirection(null);
    }, 500);
  };

  const getVisibleItems = () => {
    if (!menuRef.current) return [];
    
    const menuRect = menuRef.current.getBoundingClientRect();
    const visibleItems = [];
    
    // Check explore item
    const exploreItem = menuRef.current.children[0];
    if (exploreItem) {
      const rect = exploreItem.getBoundingClientRect();
      if (rect.left >= menuRect.left - rect.width && rect.right <= menuRect.right + rect.width) {
        visibleItems.push(0);
      }
    }
    
    // Check category items
    categories.forEach((_, index) => {
      const item = menuRef.current.children[index + 1];
      if (item) {
        const rect = item.getBoundingClientRect();
        if (rect.left >= menuRect.left - rect.width && rect.right <= menuRect.right + rect.width) {
          visibleItems.push(index + 1);
        }
      }
    });
    
    return visibleItems;
  };

  const updateScrollStatus = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setScrollPosition(scrollLeft);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollStatus();
    const handleResize = () => updateScrollStatus();
    
    const currentMenuRef = menuRef.current;
    if (currentMenuRef) {
      currentMenuRef.addEventListener("scroll", updateScrollStatus);
    }
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      if (currentMenuRef) {
        currentMenuRef.removeEventListener("scroll", updateScrollStatus);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "explore") {
      navigate("/");
    } else {
      navigate(`/category/${categoryId}`);
    }
    setActiveCategory(categoryId);
  };

  const getItemClassName = (index) => {
    let baseClass = "flex flex-col items-center justify-center mx-0 transition-all duration-300 ease-in-out";
    
    if (animatingItems.has(index)) {
      if (slideDirection === "right") {
        baseClass += " animate-slide-from-right";
      } else if (slideDirection === "left") {
        baseClass += " animate-slide-from-left";
      }
    }
    
    return baseClass;
  };

  return (
    <div className="sticky top-0 z-20 border-b bg-white shadow-sm">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 lg:px-0 py-3 ">
        {/* Left Scroll Button */}
        {scrollPosition > 0 && (
          <button
            onClick={scrollLeft}
            className="w-8 h-8  items-center justify-center border rounded-full shadow-md text-gray-600 hover:text-orange-500 hover:shadow-lg transition-all duration-300 hidden md:flex bg-white hover:bg-orange-50"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
        )}

        {/* Categories List */}
        <div
          ref={menuRef}
          className="flex items-center gap-[50px] space-x-2 overflow-x-auto scrollbar-hide flex-grow px-0 cursor-pointer scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          <div
            className={`${getItemClassName(0)} hover:text-orange-500 group ${
              activeCategory === "explore" ? "text-orange-500" : "text-gray-700"
            }`}
            onClick={() => handleCategoryClick("explore")}
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-all duration-300">
              <img
                src={explore}
                alt="Explore"
                className="w-8 h-8 transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="text-xs mt-1 font-medium border-b-2 border-transparent group-hover:border-orange-500 transition-all duration-300">
              Explore
            </div>
          </div>

          {/* Categories */}
          {categories.map((category, index) => (
            <div
              key={category._id}
              className={`${getItemClassName(index + 1)} hover:text-orange-500 group ${
                activeCategory === category._id ? "text-orange-500" : "text-gray-700"
              }`}
              onClick={() => handleCategoryClick(category._id)}
            >
              <div className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-all duration-300">
                <img
                  src={`${import.meta.env.VITE_APP_API_URL}${category.svgPath}`}
                  alt={category.name}
                  className="w-8 h-8 transform transition-transform duration-300 group-hover:scale-110"
                />
                {category.isTrending && (
                  <div className="absolute top-1 right-[-1.75rem] bg-orange-500 text-white text-[6px] font-semibold px-1 py-[1px] rounded-full shadow">
                    Trending
                  </div>
                )}
              </div>
              <div className="text-xs mt-1 font-medium border-b-2 border-transparent group-hover:border-orange-500 transition-all duration-300">
                {category.name}
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="w-8 h-8 items-center justify-center border rounded-full shadow-md text-gray-600 hover:text-orange-500 hover:shadow-lg transition-all duration-300 hidden md:flex bg-white hover:bg-orange-50"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* CSS for cave-like animations */}
      <style jsx>{`
        @keyframes slideFromRight {
          0% {
            transform: translateX(100%) scale(0.7);
            opacity: 0;
            filter: brightness(50%);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: brightness(100%);
          }
        }
        
        @keyframes slideFromLeft {
          0% {
            transform: translateX(-100%) scale(0.7);
            opacity: 0;
            filter: brightness(50%);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: brightness(100%);
          }
        }
        
        .animate-slide-from-right {
          animation: slideFromRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          perspective: 1000px;
        }
        
        .animate-slide-from-left {
          animation: slideFromLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default HorizontalMenu;