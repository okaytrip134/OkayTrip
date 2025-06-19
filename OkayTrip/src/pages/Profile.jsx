import React, { useState, useEffect } from "react";
import axios from "axios";
import UserProfileSidebar from "../components/UserProfileSidebar";
import UserProfileContent from "../components/UserProfileContent";
import SupportAndFAQs from "./SupportAndFAQs";
import UserFooter from "../users/UserFooter"; // Correctly imported
import ProfileBookings from "./ProfileBooking";
import UserCoupons from "./PurchasedCoupon";

const Profile = () => {
  const API_URL = "http://localhost:8000";
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="w-full sm:w-1/4 bg-white shadow-md">
          <UserProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          {activeTab === "profile" && (
            <UserProfileContent activeTab={activeTab} user={user} />
          )}
          {activeTab === "support" && <SupportAndFAQs />}
          {activeTab === "bookings" && <ProfileBookings />}
          {activeTab === "usercoupons" && <UserCoupons/>}
        </div>
      </div>
      <UserFooter /> {/* Footer correctly placed */}
    </div>
  );
};

export default Profile;