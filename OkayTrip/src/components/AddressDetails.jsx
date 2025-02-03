import React, { useState, useEffect } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

const AddressDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
    zip: "",
    addressLine: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const API_URL = 'http://localhost:8000';
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/user/profile/address`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.trim() !== "") {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      setErrors({
        ...errors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("userToken");
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/user/profile/address`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false);
      setIsSuccess(true); // Show success modal
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccess(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="border-t pt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Address Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 font-medium cursor-pointer transition-colors duration-200"
        >
          <MdOutlineModeEditOutline className="text-lg" />
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: "City", name: "city", placeholder: "Jaipur" },
            { label: "State", name: "state", placeholder: "Rajasthan" },
            { label: "Country", name: "country", placeholder: "India" },
            { label: "Zip Code", name: "zip", placeholder: "311001" },
            {
              label: "Address Line",
              name: "addressLine",
              placeholder: "Enter your address (e.g., 123 Main St)",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-600">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder={field.placeholder}
                className={`w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-gray-500 ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              />
              {errors[field.name] && (
                <span className="text-sm text-red-500">{errors[field.name]}</span>
              )}
            </div>
          ))}
          <div className="col-span-2">
            <button
              onClick={handleSave}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              {isLoading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          {formData.city || formData.state || formData.country || formData.zip || formData.addressLine ? (
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>City:</strong> {formData.city}
              </p>
              <p>
                <strong>State:</strong> {formData.state}
              </p>
              <p>
                <strong>Country:</strong> {formData.country}
              </p>
              <p>
                <strong>Zip Code:</strong> {formData.zip}
              </p>
              <p>
                <strong>Address:</strong> {formData.addressLine}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">
              No address details added yet.
            </p>
          )}
        </div>
      )}

      {/* Success Modal */}
      {isSuccess && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="flex justify-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      </div>
      <h3 className="text-xl font-bold mb-2">Saved!</h3>
      <p className="text-gray-600">Your address has been updated successfully.</p>
      <button
        onClick={closeSuccessModal}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        OK
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default AddressDetails;
