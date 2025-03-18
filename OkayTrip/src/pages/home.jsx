import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/Logo/Trip ok new 2 black-01.png"; // ✅ Import company logo
const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/auth/forgot-password`,
        { email }
      );

      // ✅ Show Success Notification
      toast.success(data.message || "Password reset link sent to your email!", { autoClose: 3000 });

      // ✅ Set flag to show login popup after redirection
      localStorage.setItem("showLogin", "true");

      // ✅ Wait for toast to close, then redirect to home page
      toast.onChange((payload) => {
        if (payload.status === "removed") {
          navigate("/");
        }
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* ✅ Toast Notification Container */}
      <ToastContainer position="top-center" />
      
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-6">
          {/* Company Logo */}
          <div className="w-50 h-32 mb-4">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f97316'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='20' text-anchor='middle' fill='white' dominant-baseline='middle'%3ELOGO%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Forgot Password
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>

          {/* ✅ Redirect to Login */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Remember your password? 
              <button
                onClick={() => {
                  localStorage.setItem("showLogin", "true");
                  navigate("/");
                }}
                className="text-orange-500 hover:text-orange-600 font-bold ml-1"
              >
                Go to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;