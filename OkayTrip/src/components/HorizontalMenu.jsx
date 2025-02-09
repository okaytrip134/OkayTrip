import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import explore from "../assets/svg/explore.svg";

const HorizontalMenu = () => {
  const API_URL = "http://localhost:8000";
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("explore");
  const menuRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      // const adminToken = localStorage.getItem("adminToken");
      // if (!adminToken) {
      //   console.error("Admin token is missing. Please log in.");
      //   return;
      // }

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
    menuRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    menuRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const updateScrollStatus = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setScrollPosition(scrollLeft);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // Slight offset for rounding errors
    }
  };

  useEffect(() => {
    updateScrollStatus();
    const handleResize = () => updateScrollStatus();
    menuRef.current?.addEventListener("scroll", updateScrollStatus);
    window.addEventListener("resize", handleResize);
    return () => {
      menuRef.current?.removeEventListener("scroll", updateScrollStatus);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "explore") {
      navigate("/"); // Navigate to Explore Page
    } else {
      navigate(`/category/${categoryId}`); // Navigate to Category Page
    }
    setActiveCategory(categoryId);
  };

  return (
    <div className="sticky bg-white top-0 z-10 border-b-[1px] max-w-[1440px] mx-auto flex items-center justify-between px-4 py-4 md:px-[50px] lg:px-[100px]">
      {/* Left Scroll Button */}
      {scrollPosition > 0 && (
        <button
          onClick={scrollLeft}
          className="w-10 h-10 border rounded-full shadow hover:text-orange-500 transition-all"
        >
          &#8592;
        </button>
      )}

      {/* Categories List */}
      <div
        ref={menuRef}
        className="flex items-center space-x-6 overflow-x-auto scrollbar-hide flex-grow px-4 cursor-pointer"
      >
        <div
          className={`flex flex-col items-center justify-center min-w-[100px] hover:text-orange-500 group ${
            activeCategory === "explore" ? "text-orange-500" : ""
          }`}
          onClick={() => handleCategoryClick("explore")}
        >
          <img
            src={explore}
            alt="Explore"
            className="w-8 h-8 transform transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="text-sm font-semibold border-b-2 border-transparent group-hover:border-orange-500">
            Explore
          </div>
        </div>

        {/* Categories */}
        {categories.map((category) => (
          <div
            key={category._id}
            className={`flex flex-col items-center justify-center min-w-[100px] hover:text-orange-500 group ${
              activeCategory === category._id ? "text-orange-500" : ""
            }`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_APP_API_URL}${category.svgPath}`}
                alt={category.name}
                className="w-8 h-8 transform transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              {category.isTrending && (
                <div className="absolute top-0 right-[28px] bg-orange-500 text-white text-[6px] font-semibold px-1.5 py-[1px] rounded-full shadow-md">
                  Trending
                </div>
              )}
            </div>
            <div className="text-sm border-b-2 border-transparent font-semibold group-hover:border-orange-500">
              {category.name}
            </div>
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="w-10 h-10 border rounded-full shadow hover:text-orange-500 transition-all"
        >
          &#8594;
        </button>
      )}
    </div>
  );
};

export default HorizontalMenu;
