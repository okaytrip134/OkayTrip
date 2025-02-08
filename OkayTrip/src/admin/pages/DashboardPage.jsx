import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-full">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">ok-admin</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard/top-sale-bar")}
              >
                Top Sale Bar
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard/Users")}
              >
                Users
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard/Categories")}
              >
                Categories
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard/Packages")}
              >
                Packages
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard/booking-report")}
              >
                Booking Report
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/admin/dashboard/banner-manager")}
              >
                Banners
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
