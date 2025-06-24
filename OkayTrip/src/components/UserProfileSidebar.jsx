import React, { useEffect, useState } from "react";
import { FaUser, FaClipboardList, FaQuestionCircle, FaTicketAlt, FaWallet } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const UserProfileSidebar = ({ activeTab, setActiveTab }) => {
  const [user, setUser] = useState(null);
  const [bgColor, setBgColor] = useState("");

  const tabs = [
    { id: "profile", label: "My Profile", icon: <FaUser /> },
    { id: "bookings", label: "My Bookings", icon: <FaClipboardList />},
    { id: "usercoupons", label: "My Coupons", icon: <FaTicketAlt /> },
    { id: "userwallet", label: "Ok Wallet", icon: <FaWallet /> },
    { id: "support", label: "Support & FAQs", icon: <FaQuestionCircle /> },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error(data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Generate a random background color
    const generateRandomColor = () => {
      const colors = [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FFC300",
        "#FF33A6",
        "#33FFF5",
      ]; // Define your color palette
      return colors[Math.floor(Math.random() * colors.length)];
    };

    setBgColor(generateRandomColor());
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Show loading message until user data is fetched
  }

  return (
    <div className="p-6 space-y-6"
    >
      <div className="text-center">
        {/* Display First Letter of User Name with Random Background */}
        <div
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-5xl font-bold"
          style={{ backgroundColor: bgColor,  }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <h3 className="mt-4 text-lg font-semibold">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <ul className="space-y-4">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
              activeTab === tab.id
                ? "bg-orange-100 text-orange-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-3">{tab.icon}</span>
            <span>{tab.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfileSidebar;