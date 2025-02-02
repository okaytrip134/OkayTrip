import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="fixed h-full inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* ✅ Toast Notification Container */}
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-6 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>

        {/* ✅ Redirect to Login */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            <span>Remember your password? </span>
            <button
              onClick={() => {
                localStorage.setItem("showLogin", "true");
                navigate("/");
              }}
              className="text-orange-500 hover:text-orange-600 font-bold"
            >
              Go to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
