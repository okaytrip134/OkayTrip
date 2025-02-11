import React, { useState, useEffect, lazy, Suspense } from "react";
import { FaUser, FaPhoneAlt, FaEnvelope, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddressDetails from "./AddressDetails";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line react/prop-types
const UserProfileContent = ({ activeTab }) => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editMode, setEditMode] = useState(null); // 'profile', 'phone', 'password'
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setFormData({ name: data.name, email: data.email, phone: "" });
        } else {
          console.log("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    let url;
    let body;
    if (editMode === "profile") {
      url = `${import.meta.env.VITE_APP_API_URL}/api/user/profile`;
      body = { name: formData.name, email: formData.email };
    } else if (editMode === "phone") {
      url = `${import.meta.env.VITE_APP_API_URL}/api/user/profile`;
      body = { phone: formData.phone };
    } else if (editMode === "password") {
      url = `${import.meta.env.VITE_APP_API_URL}/api/user/profile`;
      body = { password: formData.password };
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Updated successfully");
        setEditMode(null);
        setDropdownVisible(false);
        if (editMode === "profile") {
          const updatedUser = { ...user, name: formData.name, email: formData.email };
          setUser(updatedUser);
        }
      } else {
        console.log("Failed to update");
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto mt-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          <Skeleton width={200} />
        </h2>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <Skeleton circle height={50} width={50} />
            <Skeleton height={20} width="80%" className="mt-2" />
          </div>
          <div>
            <Skeleton circle height={50} width={50} />
            <Skeleton height={20} width="80%" className="mt-2" />
          </div>
        </div>
        <div className="mt-6">
          <Skeleton height={20} width="60%" />
          <Skeleton height={20} width="90%" className="mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto mt-8 p-6">
      {/* Check if activeTab is 'profile' */}
      {activeTab === "profile" && (
        <div>
          <div className="border-b pb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">My Profile</h2>
            <button
              className="text-gray-500 hover:text-gray-800 relative"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <FaEllipsisV className="w-6 h-6 text-gray-300" />
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md p-2">
                  <button
                    onClick={() => {
                      setEditMode("profile");
                      setDropdownVisible(false);
                    }}
                    className="flex items-center space-x-2 w-full py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="w-5 h-5 text-gray-300" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditMode("phone");
                      setDropdownVisible(false);
                    }}
                    className="flex items-center space-x-2 w-full py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaPhoneAlt className="w-5 h-5 text-gray-300" />
                    <span>Change Phone</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditMode("password");
                      setDropdownVisible(false);
                    }}
                    className="flex items-center space-x-2 w-full py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="w-5 h-5 text-gray-300" />
                    <span>Update Password</span>
                  </button>
                </div>
              )}
            </button>
          </div>

          {/* Edit Modes */}
          {editMode === "profile" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Edit Profile</h3>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full border px-4 py-2 mb-4"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full border px-4 py-2 mb-4"
                />
                <div className="flex space-x-4">
                <button
                    onClick={handleSave}
                    className="bg-transparent hover:bg-[#f7b014] border-[#f7b014] border-2 text-black hover:text-white px-4 py-2 "
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="hover:bg-transparent bg-[#f7b014] px-4 py-2 border-[#f7b014] border-2 hover:text-black text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Modes */}
          {editMode === "phone" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Change Phone</h3>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="New Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full border px-4 py-2 mb-4"
                />
                <div className="flex space-x-4">
                <button
                    onClick={handleSave}
                    className="bg-transparent hover:bg-[#f7b014] border-[#f7b014] border-2 text-black hover:text-white px-4 py-2 "
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="hover:bg-transparent bg-[#f7b014] px-4 py-2 border-[#f7b014] border-2 hover:text-black text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {editMode === "password" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Update Password</h3>
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full border px-4 py-2 mb-4"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="bg-transparent hover:bg-[#f7b014] border-[#f7b014] border-2 text-black hover:text-white px-4 py-2 "
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="hover:bg-transparent bg-[#f7b014] px-4 py-2 border-[#f7b014] border-2 hover:text-black text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Default Profile View */}
          {editMode === null && (
            <div>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-300 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-300 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <FaPhoneAlt className="text-gray-300 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <a
                  onClick={() => navigate("/profile/change-phone")}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Click to verify
                </a>
              </div>
              <Suspense fallback={<Skeleton height={100} count={3} />}>
                <AddressDetails />
              </Suspense>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileContent;
