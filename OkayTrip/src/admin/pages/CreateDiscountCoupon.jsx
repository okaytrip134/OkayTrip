// src/pages/admin/CreateDiscountCoupon.jsx

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateDiscountCoupon = () => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "flat",
    value: "",
    maxDiscount: "",
    minOrderAmount: "",
    usageLimitPerUser: 1,
    expiresAt: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/discount/create`, formData);
      toast.success("Coupon created successfully");
      setFormData({
        code: "",
        discountType: "flat",
        value: "",
        maxDiscount: "",
        minOrderAmount: "",
        usageLimitPerUser: 1,
        expiresAt: "",
        isActive: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ToastContainer position="top-center" />
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Create Discount Coupon</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <label className="block text-sm font-medium">Coupon Code *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Discount Type *</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Discount Value *</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {formData.discountType === "percentage" && (
          <div>
            <label className="block text-sm font-medium">Max Discount Amount (₹)</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Minimum Order Amount *</label>
          <input
            type="number"
            name="minOrderAmount"
            value={formData.minOrderAmount}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Max Usage Per User</label>
          <input
            type="number"
            name="usageLimitPerUser"
            value={formData.usageLimitPerUser}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Expiry Date *</label>
          <input
            type="datetime-local"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-sm">Is Active</label>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default CreateDiscountCoupon;
