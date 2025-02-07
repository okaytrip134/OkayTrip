import React, { useState } from "react";
import axios from "axios";

const UserAuth = ({ onClose }) => {
  const API_URL = "http://localhost:8000";
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");

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
        alert("Signup Successful!");
      }
  
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Login Error:", error);
      setError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password"; // Redirect to Forgot Password page
  };

  return (
    <div className="fixed h-full md:h-auto inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl flex overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>

        {/* Left Section: Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://img.freepik.com/free-photo/traveller-sitting-rock-holding-camera-take-photo-doi-pha-mon-mountains-chiang-rai-thailand_335224-1078.jpg?t=st=1736686599~exp=1736690199~hmac=48eb3dec62154164e91b3fe540974349192fecfa29b37fdc8eb14a69527986fa&w=996"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white px-4">
            <h2 className="text-3xl font-bold mb-2">Welcome to Our Platform</h2>
            <p className="text-lg">
              Experience seamless login and signup with our user-friendly portal.
            </p>
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
              className={`text-lg font-bold px-4 py-2 ${
                isLogin
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`text-lg font-bold px-4 py-2 ${
                !isLogin
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
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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
