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
  SettingOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import dasboard from '../../assets/icons/ic-analysis.svg';
import management from '../../assets/icons/ic-management.svg';
import setting from '../../assets/icons/ic-setting.svg';
import user from '../../assets/icons/ic-user.svg'
import report from '../../assets/icons/ic-workbench.svg'
import packages from '../../assets/icons/ic-files.svg'
import categories from '../../assets/icons/ic-category.svg'
import { FaComment } from "react-icons/fa";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleManagement = () => {
    setManagementOpen(!managementOpen);
  };

  // Create a reusable SVG icon component
  const SvgIcon = ({ src, alt = "" }) => {
    return <img src={src} alt={alt} style={{ width: '1em', height: '1em' }} />;
  };

  const menuItems = [
    { name: "Dashboard", icon: <SvgIcon src={dasboard} alt="Dashboard" />, path: "/admin/dashboard" },
    { name: "Users", icon: <SvgIcon src={user} alt="User"/>, path: "/admin/dashboard/Users" },
    {
      name: "Management",
      icon: <SvgIcon src={setting} alt="Management" />,
      isDropdown: true,
      items: [
        { name: "Banners", icon: <SvgIcon src={packages} alt="Management" />, path: "/admin/dashboard/banner-manager" },
        {name: "Reviews", icon:<FaComment/>, path: "/admin/dashboard/Admin-reviews"},
        { name: "Coupon-Report", icon: <SvgIcon src={packages} alt="Management" />, path: "/admin/dashboard/Coupon-Report" },
        { name: "Top Sale Bar", icon: <BarChartOutlined />, path: "/admin/dashboard/top-sale-bar" },
      ]
    },
    { name: "Categories", icon: <SvgIcon src={categories} alt="Management" />, path: "/admin/dashboard/Categories" },
    { name: "Packages", icon: <SvgIcon src={management} alt="Management" />, path: "/admin/dashboard/Packages" },
    { name: "Booking Report", icon: <SvgIcon src={report} alt="Management" />, path: "/admin/dashboard/booking-report" },
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
        } bg-white fixed h-full transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2
            className={`text-xl font-bold  text-gray-800 transition-all duration-300 ${
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
              <li key={index} className="my-4">
                {item.isDropdown ? (
                  <div>
                    <button
                      className={`w-full flex items-center px-4 py-4 text-gray-700 hover:bg-gray-200 transition-all duration-300 ${
                        isSidebarOpen ? "justify-start" : "justify-center"
                      }`}
                      onClick={toggleManagement}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {isSidebarOpen && (
                        <div className="ml-4 flex items-center justify-between flex-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <DownOutlined 
                            className={`transition-transform duration-200 ${
                              managementOpen ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>
                      )}
                    </button>
                    {isSidebarOpen && managementOpen && (
                      <ul className="pl-8 mt-1">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="my-1">
                            <button
                              className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 transition-all duration-300 justify-start"
                              onClick={() => navigate(subItem.path)}
                            >
                              <span className="text-lg">{subItem.icon}</span>
                              <span className="ml-3 text-sm font-medium">
                                {subItem.name}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
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
                )}
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
              <UserOutlined className="text-2xl text-gray-600" />
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