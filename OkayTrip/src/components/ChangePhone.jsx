import  { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ChangePhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  // Back click handler
  const handleBackClick = () => {
    navigate("/profile"); // Navigate to /profile
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleVerify = () => {
    console.log("Phone Number Submitted:", phoneNumber);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Back Button */}
      <div className="flex items-center space-x-2 mb-4" onClick={handleBackClick}>
        <FiArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" />
        <h2 className="text-lg font-semibold">Change Phone Number</h2>
      </div>

      {/* Phone Input Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Phone Number
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <span className="text-gray-500 mr-2">+91</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter your phone number"
              className="flex-1 border-none focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleVerify}
          className="w-full sm:w-auto bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-200"
        >
          verify
        </button>
      </div>
    </div>
  );
};

export default ChangePhone;
