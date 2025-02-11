import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast
import { FaEye, FaEyeSlash } from "react-icons/fa";
const UserAuth = ({ onClose }) => {
  // const API_URL = "http://localhost:8000";
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [bannerData, setBannerData] = useState({
    title: "Welcome to Our Platform",
    subtitle: "Experience seamless login and signup with our user-friendly portal.",
    imageUrl: "https://via.placeholder.com/500x500", // Placeholder for initial state
  });
  useEffect(() => {
    // Fetch Banner Data
    const fetchBannerData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/banner`);
        if (data.banner) {
          setBannerData(data.banner);
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
        toast.error("Failed to fetch banner data.");
      }
    };
    fetchBannerData();
  }, []);
  
  const [showPassword, setShowPassword] = useState(false);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError(""); // Reset error

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };

      const endpoint = isLogin
        ? `${import.meta.env.VITE_APP_API_URL}/api/user/auth/login`
        : `${import.meta.env.VITE_APP_API_URL}/api/user/auth/register`;

      const { data } = await axios.post(endpoint, payload);

      console.log("Response from API:", data); // Debugging

      if (isLogin) {
        if (!data.token) {
          throw new Error("Login failed: No token received");
        }

        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", data.user.name);

        // Extract expiry from JWT
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        localStorage.setItem("tokenExpiry", expiryTime);

        console.log("Token Expiry Set:", expiryTime); // Debugging
      } else {
        toast.success("Signup successful!!");
      }

      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password"; // Redirect to Forgot Password page
  };

  return (
    <div className="fixed h-full md:h-auto inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
      <Toaster position="top-right" /> {/* Toast Notification Container */}
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl flex overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>

        {/* Left Section: Image */}
        {/* Left Section: Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={`${import.meta.env.VITE_APP_API_URL}${bannerData.imageUrl}`}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 via-black/ to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex flex-col justify-end items-start text-left text-white px-4">
            <h2 className="text-3xl font-bold mb-2">{bannerData.title}</h2>
            <p className="text-lg">{bannerData.subtitle}</p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full md:w-1/2 p-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
            {isLogin ? "Log into Your Account" : "Create Your Account"}
          </h2>

          {/* Toggle Login/Signup */}
          <div className="flex justify-center mb-6">
            <button
              className={`text-lg font-bold px-4 py-2 ${isLogin
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500"
                }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`text-lg font-bold px-4 py-2 ${!isLogin
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500"
                }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            {!isLogin && (
              <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 px-6 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600"
          >
            {isLogin ? "Login & Continue" : "Sign Up"}
          </button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              onClick={handleForgotPassword}
              className="text-blue-500 text-sm"
            >
              Forgot Password?
            </button>
          </div>


          {/* Sign in with Google */}
          <button className="w-full mt-4 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center">
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google Icon"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>

          {/* Ratings Section */}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              Book With Confidence
            </h3>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <p className="font-bold text-gray-700">4.5/5</p>
                <p className="text-sm text-gray-500">Trip Advisor</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-700">4.0/5</p>
                <p className="text-sm text-gray-500">Trust Pilot</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-700">4.4/5</p>
                <p className="text-sm text-gray-500">Google</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-700">4.3/5</p>
                <p className="text-sm text-gray-500">Reviews.io</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
