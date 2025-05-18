import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/Logo/Trip ok new 2 black-01.png";

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOTP = async () => {
    if (!email) return toast.error("Please enter your email.");
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/auth/send-otp`, { email });
      toast.success(data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
  if (!otp || !newPassword || !confirmPassword) return toast.error("All fields are required.");
  if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
  if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");

  try {
    setLoading(true);
    const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/auth/reset-password-otp`, {
      email,
      otp,
      password: newPassword,
    });

    toast.success(data.message || "Password reset successful");

    setTimeout(() => {
      onClose(); // ✅ Close the popup
    }, 1000);

  } catch (err) {
    toast.error(err.response?.data?.message || "Reset failed");
  } finally {
    setLoading(false);
  }
};
const handleVerifyOTP = async () => {
  if (!otp.trim()) {
    toast.error("Please enter the OTP.");
    return;
  }

  try {
    setLoading(true);
    const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/auth/verify-otp`, {
      email,
      otp,
    });
    toast.success(data.message);
    setStep(3);
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid or expired OTP");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <ToastContainer position="top-center" />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl">×</button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-20 mb-4">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Set New Password"}
          </h2>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <label className="block text-gray-700 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-gray-700 text-sm font-medium">OTP</label>
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                  onClick={handleVerifyOTP}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-gray-700 text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="block text-gray-700 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
