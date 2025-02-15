import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  BarChartOutlined,
  UserOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  PictureOutlined,
  LogoutOutlined,
  MenuOutlined,
  DownOutlined,
  // UserCircleOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <HomeOutlined />, path: "/admin/dashboard" },
    { name: "Top Sale Bar", icon: <BarChartOutlined />, path: "/admin/dashboard/top-sale-bar" },
    { name: "Users", icon: <UserOutlined />, path: "/admin/dashboard/Users" },
    { name: "Categories", icon: <AppstoreOutlined />, path: "/admin/dashboard/Categories" },
    { name: "Packages", icon: <FolderOpenOutlined />, path: "/admin/dashboard/Packages" },
    { name: "Booking Report", icon: <FileTextOutlined />, path: "/admin/dashboard/booking-report" },
    { name: "Banners", icon: <PictureOutlined />, path: "/admin/dashboard/banner" },
  ];

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/admin/dashboard")}>
        <HomeOutlined className="mr-2" /> Dashboard
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        <LogoutOutlined className="mr-2" /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md fixed h-full transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2
            className={`text-xl font-bold text-gray-800 transition-all duration-300 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            OK-Admin
          </h2>
          <MenuOutlined
            className="text-xl cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          />
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="my-1">
                <button
                  className={`w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 transition-all duration-300 ${
                    isSidebarOpen ? "justify-start" : "justify-center"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span
                    className={`ml-4 text-sm font-medium transition-all duration-300 ${
                      isSidebarOpen ? "block" : "hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
                        <li className="mt-6">
              <button
                className={`w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-100 transition-all duration-300 ${
                  isSidebarOpen ? "justify-start" : "justify-center"
                }`}
                onClick={handleLogout}
              >
                <LogoutOutlined className="text-xl" />
                <span
                  className={`ml-4 text-sm font-medium transition-all duration-300 ${
                    isSidebarOpen ? "block" : "hidden"
                  }`}
                >
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
          <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
            <button className="flex items-center space-x-2 focus:outline-none">
            <UserOutlined  className="text-2xl text-gray-600" />
              <span className="text-gray-700">Admin</span>
              <DownOutlined className="text-sm text-gray-600" />
            </button>
          </Dropdown>
        </header>
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
