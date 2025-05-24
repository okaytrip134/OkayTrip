import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ForgotPassword from "../pages/ForgotPassword";

const UserAuth = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
    imageUrl: "https://via.placeholder.com/500x500",
  });

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/banner`);
        if (data.banner) setBannerData(data.banner);
      } catch (error) {
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
      setError("");
      const payload = isLogin ? 
        { emailOrPhone: formData.emailOrPhone, password: formData.password } : 
        { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone };

      const endpoint = isLogin ? 
        `${import.meta.env.VITE_APP_API_URL}/api/user/auth/login` : 
        `${import.meta.env.VITE_APP_API_URL}/api/user/auth/register`;

      const { data } = await axios.post(endpoint, payload);

      if (isLogin) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", data.user.name);
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("tokenExpiry", decodedToken.exp * 1000);
      } else {
        toast.success("Signup successful!");
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="fixed h-full inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
      {showForgotPassword ? (
        <ForgotPassword onClose={() => {
          setShowForgotPassword(false);
          onClose();
        }}/>
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl flex overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold z-10">
            ✕
          </button>

          <div className="hidden md:block w-1/2 relative">
            <img
              src={`${import.meta.env.VITE_APP_API_URL}${bannerData.imageUrl}`}
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col h-full max-h-[80vh]">
            <div className="px-6 pt-6 pb-2 bg-white">
              <h2 className="text-2xl font-bold text-gray-700 text-center">
                {isLogin ? "Log into Your Account" : "Create Your Account"}
              </h2>
              <div className="flex justify-center my-4">
                <button
                  className={`text-lg font-bold px-4 py-2 ${isLogin ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
                  onClick={() => setIsLogin(true)}>
                  Login
                </button>
                <button
                  className={`text-lg font-bold px-4 py-2 ${!isLogin ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
                  onClick={() => setIsLogin(false)}>
                  Sign Up
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-4 flex-grow">
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
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </>
                )}

                {isLogin && (
                  <div className="relative">
                    <input
                      type="text"
                      name="emailOrPhone"
                      placeholder="Email or Phone Number"
                      value={formData.emailOrPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}

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
                    onClick={() => setShowPassword((prev) => !prev)}>
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
                      onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  onClick={handleSubmit}
                  className="w-full mt-4 px-6 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600">
                  {isLogin ? "Login & Continue" : "Sign Up"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-500 text-sm">
                    Forgot Password?
                  </button>
                </div>

                <button className="w-full mt-4 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center">
                  <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="Google Icon"
                    className="w-5 h-5 mr-2"
                  />
                  Sign in with Google
                </button>

                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Book With Confidence</h3>
                  <div className="flex justify-center space-x-4">
                    {["Trip Advisor", "Trust Pilot", "Google", "Reviews.io"].map((service) => (
                      <div key={service} className="text-center">
                        <p className="font-bold text-gray-700">4.5/5</p>
                        <p className="text-sm text-gray-500">{service}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAuth;