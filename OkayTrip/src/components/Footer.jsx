import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
    const [categories, setCategories] = useState([]);

  // ✅ Fetch Packages & Extract Categories
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/admin/packages");
        
        // Extract unique categories with images
        const uniqueCategories = [];
        const categoryMap = new Map();

        data.packages.forEach((pkg) => {
          if (!categoryMap.has(pkg.categoryId)) {
            categoryMap.set(pkg.categoryId, {
              id: pkg.categoryId,
              name: pkg.categoryName,
              image: pkg.images[0], // ✅ First uploaded image from package
            });
          }
        });

        setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);
  return (
    <footer className="bg-gray-900 text-white">
      {/* ✅ Main Footer Content */}
      <div className="max-w-[1440px] mx-auto py-10 px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-[1080px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 🔹 About Thrillophilia */}
            <div className="border-r-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">ABOUT OkayTrip</h3>
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
                {["Delhi", "Kolkata", "Bihar", "Rajasthan", "Agra", "Jaipur", "Banglore", "Kerla"].map((dest, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={`/images/${dest.toLowerCase()}.jpg`} // Add actual image URLs
                      alt={dest}
                      className="w-full h-16 object-cover rounded-md"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-bold">
                      {dest}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Footer */}
      <div className="text-center py-6 border-t border-gray-700 max-w-[1080px] mx-auto">
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
