import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { MdPerson, MdLogout } from "react-icons/md";
import { RiArrowDropDownFill } from "react-icons/ri";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo/Trip ok new 2 black-01.png";
import SearchPopup from "./SearchPopup";
import UserAuth from "./UserAuth";
import TopSaleBar from "./TopsaleBar";
import HorizontalMenu from "./HorizontalMenu";
import { toast } from "react-hot-toast"; // ✅ Import from react-hot-toast
import { Toaster } from "react-hot-toast"; // ✅ Toaster Component

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("tokenExpiry");
    setIsLoggedIn(false);
    setUserName("");
    setShowDropdown(false);
    toast.success("Logged out successfully!"); // ✅ react-hot-toast notification
    navigate("/");
  };

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("userToken");
    const name = localStorage.getItem("userName");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token || !tokenExpiry) {
      setIsLoggedIn(false);
      setUserName("");
      return;
    }

    const expiryTime = Number(tokenExpiry); // Convert string to number
    const currentTime = Date.now();

    console.log("Current Time:", currentTime, "Stored Expiry:", expiryTime); // Debugging

    if (currentTime >= expiryTime) {
      console.warn("Token expired, logging out...");
      handleLogout();
    } else {
      setIsLoggedIn(true);
      setUserName(name || "User");
    }
  };

  // ✅ Run only when the component mounts
  useEffect(() => {
    checkTokenExpiry();

    // ✅ Periodically check token expiry every 1 minute
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  const places = [
    "destinations",
    "Delhi",
    "Manali",
    "Uttrakhand",
    "Goa",
    "Kashmir",
    "Shimla",
    "Ladak",
  ];

  useEffect(() => {
    let typingTimeout;

    const handleTypingEffect = () => {
      const currentPlace = places[currentIndex];

      if (!isDeleting) {
        // Typing phase
        setTypewriterText((prev) =>
          currentPlace.substring(0, prev.length + 1)
        );

        if (typewriterText === currentPlace) {
          // Pause after fully typing a word
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        // Deleting phase
        setTypewriterText((prev) =>
          currentPlace.substring(0, prev.length - 1)
        );

        if (typewriterText === "") {
          // Switch to the next word
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % places.length);
        }
      }
    };

    typingTimeout = setTimeout(
      handleTypingEffect,
      isDeleting ? 50 : 100 // Typing speed: 100ms, Deleting speed: 50ms
    );

    return () => clearTimeout(typingTimeout);
  }, [typewriterText, isDeleting, currentIndex]);

  // Determine if Navbar should be sticky
  const isSticky = location.pathname === "/profile";

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ react-hot-toast Toaster */}
      <TopSaleBar />
      <header
        className={`bg-white top-0 z-50 border-b-2 ${isSticky ? "sticky" : ""
          }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-4 md:px-[50px] lg:px-[100px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-12 md:h-[2.5rem] lg:h-[3rem]" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative flex-grow max-w-[20rem] mx-4 hidden sm:flex">
            <div
              className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white w-full"
              style={{
                boxShadow: "0 1px 8px 0 rgba(0,0,0,.1)",
              }}
            >
              <FiSearch className="text-gray-400 mr-2 text-lg" />
              <span className="absolute left-[50px] text-sm font-semibold">
                <span className="text-gray-400">Search for </span>
                <span className="text-black">{typewriterText}</span>
                <span className="blinking-cursor">|</span>
              </span>
              <input
                type="text"
                className="flex-grow pl-3 text-sm text-grey-600 placeholder-transparent focus:outline-none"
                onClick={togglePopup}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="relative">
            {isLoggedIn ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                  {userName.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Hi, {userName.slice(0, 7)}</span>
                  <RiArrowDropDownFill className="text-xl ml-1" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthPopup(true)}
                className="text-sm text-gray-700 font-medium hover:text-orange-500 transition-all"
              >
                Login
              </button>
            )}

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border z-50 shadow-lg py-2 w-56">
                <button
                  className="flex items-center px-4 py-2 text-left w-full hover:bg-[#f47c20b1] border-b-[1px]"
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                >
                  <MdPerson className="text-gray-500 mr-2" />
                  My Profile
                </button>
                <button
                  className="flex items-center px-4 py-2 text-left w-full text-red-500 hover:bg-[#f47c20b1]"
                  onClick={handleLogout}
                >
                  <MdLogout className="text-red-500 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Login/Signup Popup */}
        {showAuthPopup && (
          <UserAuth onClose={() => {
            setShowAuthPopup(false);
            if (localStorage.getItem("userToken")) {
              setIsLoggedIn(true);
              setUserName(localStorage.getItem("userName"));
              toast.success("Login Successful!");
            }
          }} />
        )}
        {/* Search Popup */}
        {showPopup && <SearchPopup onClose={togglePopup} />}
      </header>

      {/* Horizontal Menu */}
      {location.pathname !== "/profile" && <HorizontalMenu />}
    </>
  );
};

export default Navbar;
