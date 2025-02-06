import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo/Trip ok new 2 white.png';

const Footer = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Fetch all active categories
        const { data: categories } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/categories/`);

        if (!categories || categories.length === 0) {
          console.error("No categories found.");
          return;
        }

        const allPackages = [];

        for (const category of categories) {
          const { data: categoryPackages } = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/category/${category._id}`
          );

          if (categoryPackages.length > 0) {
            allPackages.push({
              categoryId: category._id,
              name: category.name,
              image: categoryPackages[0].images && categoryPackages[0].images.length > 0
                ? categoryPackages[0].images[0]  // ✅ Always select the first image
                : "/fallback-image.png",
            });
          }
        }

        // Shuffle & Limit to 9 packages
        setPackages(allPackages.sort(() => 0.5 - Math.random()).slice(0, 9));

      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1440px] mx-auto py-10 px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-[1080px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* 🔹 About Thrillophilia */}
            <div className="border-r-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">ABOUT THRILLOPHILIA</h3>
              <ul className="text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900">We Are Hiring</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policies</a></li>
                <li><a href="#" className="hover:text-gray-900">Copyright Policies</a></li>
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
                <li className="text-red-600 font-bold flex items-center">
                  Beware of Frauds <span className="ml-2">⚠️</span>
                </li>
              </ul>
            </div>

            {/* 🔹 For Suppliers & Brands */}
            <div className="border-r-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">FOR SUPPLIERS</h3>
              <ul className="text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-gray-900">List Your Activities</a></li>
              </ul>
              <h3 className="text-lg font-bold text-gray-900 mt-4 mb-3">FOR BRANDS</h3>
              <ul className="text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-gray-900">Partner With Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Destination Marketing</a></li>
              </ul>
            </div>

            {/* 🔹 For Travellers */}
            <div className="border-r-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">FOR TRAVELLERS</h3>
              <ul className="text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-gray-900">Gift an Experience</a></li>
              </ul>
            </div>

            {/* 🔹 Travel Destinations */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">TRAVEL DESTINATIONS</h3>
              <div className="grid grid-cols-3 gap-2">
                {packages.map((pkg, index) => (
                  <div
                    key={pkg.categoryId || `package-${index}`}
                    className="relative group cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/category/${pkg.categoryId}`)}
                  >
                    <img
                      src={`${import.meta.env.VITE_APP_API_URL}${pkg.image}`}
                      alt={pkg.name}
                      className="w-full h-16 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 text-white text-sm font-bold">
                      {pkg.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ Footer Logo */}
      <div className="footer_footerlogo relative mb-10 max-w-[1080px] mx-auto flex items-center justify-center px-4">
        {/* Left Line */}
        <div className="hidden sm:block absolute left-0 sm:w-[30%] md:w-[35%] lg:w-[38%] h-[2px] bg-gray-500"></div>

        {/* Logo */}
        <a href="/" className="block max-w-[175px] w-full mx-auto my-0 cursor-pointer">
          <img src={logo} alt="OkayTrip" className="w-full" />
        </a>

        {/* Right Line */}
        <div className="hidden sm:block absolute right-0 sm:w-[30%] md:w-[35%] lg:w-[38%] h-[2px] bg-gray-500"></div>
      </div>

      {/* ✅ Bottom Footer */}
      <div className="text-center pb-6 max-w-[1080px] mx-auto">
        <div className="flex justify-center space-x-6 mb-4">
          <FaFacebookF className="text-white text-xl cursor-pointer hover:text-gray-400 transition" />
          <FaInstagram className="text-white text-xl cursor-pointer hover:text-gray-400 transition" />
          <FaTwitter className="text-white text-xl cursor-pointer hover:text-gray-400 transition" />
          <FaLinkedinIn className="text-white text-xl cursor-pointer hover:text-gray-400 transition" />
          <FaYoutube className="text-white text-xl cursor-pointer hover:text-gray-400 transition" />
        </div>

        <p className="text-gray-400 text-base font-semibold">
          © 2025 OkayTrip All rights reserved.
        </p>
        <p className="text-gray-500 text-base max-w- mx-auto mt-2 px-6">
          The content and images used on this site are copyright protected and copyright vests with the respective owners. Unauthorized use is prohibited and punishable by law.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
