/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  BarChartOutlined,
  UserOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  PictureOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  DownOutlined,
  PieChartOutlined,
  GiftOutlined,
  TagOutlined,
  PhoneFilled,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import dasboard from '../../assets/icons/ic-analysis.svg';
import management from '../../assets/icons/ic-management.svg';
import setting from '../../assets/icons/ic-setting.svg';
import Logo from '../../assets/Logo/Trip ok new 2 black-01.png';
import SmallLogo from '../../assets/favicon.ico'; // You'll need to replace this with your actual small logo
import user from '../../assets/icons/ic-user.svg'
import report from '../../assets/icons/ic-workbench.svg'
import packages from '../../assets/icons/ic-files.svg'
import categories from '../../assets/icons/ic-category.svg'
import { FaComment } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";


const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  
  // Refs for dropdown containers
  const dropdownRefs = useRef({});

  // Set active item based on current path
  useEffect(() => {
    setActiveItem(location.pathname);
    
    // Check if current path is in any dropdown, and open that dropdown when sidebar is open
    if (isSidebarOpen) {
      menuItems.forEach(item => {
        if (item.isDropdown) {
          const isInDropdown = item.items.some(subItem => location.pathname === subItem.path);
          if (isInDropdown) {
            setOpenDropdown(item.dropdownName);
          }
        }
      });
    }
  }, [location.pathname, isSidebarOpen]);

  // Close hover dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (hoveredDropdown) {
        const dropdownElement = dropdownRefs.current[hoveredDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setHoveredDropdown(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hoveredDropdown]);

  const handleLogout = async () => {
    try {
      // Clear the token from storage
      localStorage.removeItem("adminToken");
      
      // Force a hard redirect to ensure complete logout
      window.location.href = "/admin/login";
      
      // Optional: Add a small delay before navigation
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Navigate to login page (this will work if the above doesn't)
      navigate("/admin/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback to hard redirect if error occurs
      window.location.href = "/admin/login";
    }
  };

  const toggleDropdown = (dropdownName) => {
    if (isSidebarOpen) {
      // Standard toggle behavior when sidebar is open
      if (openDropdown === dropdownName) {
        setOpenDropdown(null); // Close if already open
      } else {
        setOpenDropdown(dropdownName); // Open the clicked dropdown
      }
    } else {
      // In collapsed mode, clicking directly toggles the hover state
      if (hoveredDropdown === dropdownName) {
        setHoveredDropdown(null);
      } else {
        setHoveredDropdown(dropdownName);
      }
    }
  };

  // Handle mouse enter for collapsed sidebar
  const handleMouseEnter = (dropdownName) => {
    if (!isSidebarOpen) {
      setHoveredDropdown(dropdownName);
    }
  };

  // Create a reusable SVG icon component
  const SvgIcon = ({ src, alt = "" }) => {
    return <img src={src} alt={alt} style={{ width: '1em', height: '1em' }} />;
  };

  const menuItems = [
    { name: "Dashboard", icon: <SvgIcon src={dasboard} alt="Dashboard" />, path: "/admin/dashboard" },
    { name: "Users", icon: <SvgIcon src={user} alt="User" />, path: "/admin/dashboard/Users" },
    { name: "Categories", icon: <SvgIcon src={categories} alt="Management" />, path: "/admin/dashboard/Categories" },
    { name: "Packages", icon: <SvgIcon src={packages} alt="Management" />, path: "/admin/dashboard/Packages" },
    {
      name: "Management",
      icon: <SvgIcon src={setting} alt="Management" />,
      isDropdown: true,
      dropdownName: "management",
      items: [
        { name: "Banners", icon: <PictureOutlined/>, path: "/admin/dashboard/banner" },
        { name: "Reviews", icon: <FaComment />, path: "/admin/dashboard/Admin-reviews" },
        { name: "Blogs", icon: <SvgIcon src={packages} alt="Management" />, path: "/admin/dashboard/blogs" },
        { name: "Discount Coupon", icon: <SvgIcon src={packages} alt="Discount Coupon" />, path: "/admin/dashboard/discount-coupon" },
        // { name: "Top Sale Bar", icon: <BarChartOutlined />, path: "/admin/dashboard/top-sale-bar" },
        { name: "Offer Management", icon: <GiftOutlined />, path: "/admin/dashboard/offer-manager" },
        { name: "Coupon Management", icon: <TagOutlined />, path: "/admin/dashboard/coupon-manager" },
      ]
    },
    {
      name: "Reports",
      icon: <PieChartOutlined />, // Changed to PieChartOutlined
      isDropdown: true,
      dropdownName: "reports",
      items: [
        { name: "Booking Report", icon: <SvgIcon src={report} alt="Reports" />, path: "/admin/dashboard/booking-report" },
        { name: "Leads", icon: <FileTextOutlined />, path: "/admin/dashboard/Leads" },
        { name: "Contact Enquiry", icon: <PhoneFilled />, path: "/admin/dashboard/Contact-enquiry" },
      ]
    },
  ];

  // Function to determine if an item is active
  const isActive = (path) => {
    return activeItem === path;
  };

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
        } bg-white fixed p-2 h-full transition-all duration-300 border-r-2 border-dashed border-gray-300 z-10`}
      >
        <div className="mt-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <img src={Logo} alt="logo" className="transition-all duration-300" />
          ) : (
            <img src={SmallLogo} alt="logo" className="w-12 h-12 mx-auto transition-all duration-300" />
          )}
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="my-4">
                {item.isDropdown ? (
                  <div 
                    className="relative" 
                    ref={el => dropdownRefs.current[item.dropdownName] = el}
                    onMouseEnter={() => handleMouseEnter(item.dropdownName)}
                  >
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                        isSidebarOpen ? "justify-start" : "justify-center"
                      } ${
                        item.items.some(subItem => isActive(subItem.path)) 
                          ? "bg-green-100 text-orange-500" 
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => toggleDropdown(item.dropdownName)}
                    >
                      <span className={`text-xl ${item.items.some(subItem => isActive(subItem.path)) ? "text-orange-500" : ""}`}>
                        {item.icon}
                      </span>
                      {isSidebarOpen && (
                        <div className="ml-4 flex items-center justify-between flex-1">
                          <span className={`text-base font-semibold ${item.items.some(subItem => isActive(subItem.path)) ? "text-orange-500" : ""}`}>
                            {item.name}
                          </span>
                          <IoIosArrowForward 
                            className={`text-xl transition-transform duration-500 ${
                              openDropdown === item.dropdownName ? "transform rotate-90" : "" 
                            } ${
                              item.items.some(subItem => isActive(subItem.path)) ? "text-orange-500" : ""
                            }`}
                          />
                        </div>
                      )}
                    </button>
                    
                    {/* Dropdown items - shown either in expanded sidebar or as hover popup in collapsed mode */}
                    {((isSidebarOpen && openDropdown === item.dropdownName) || 
                     (!isSidebarOpen && hoveredDropdown === item.dropdownName)) && (
                      <ul className={`mt-1 ${
                        isSidebarOpen ? "pl-4" : "absolute left-full ml-2 top-0 bg-white shadow-lg rounded-lg p-2 w-48"
                      }`}>
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="my-1">
                            <button
                              className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-300 justify-start ${
                                isActive(subItem.path) 
                                  ? "bg-green-100 text-orange-500" 
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                              onClick={() => {
                                navigate(subItem.path);
                                setActiveItem(subItem.path);
                                setHoveredDropdown(null);
                              }}
                            >
                              <span className={`text-lg ${isActive(subItem.path) ? "text-orange-500" : ""}`}>
                                {subItem.icon}
                              </span>
                              <span className={`ml-3 text-sm font-medium ${isActive(subItem.path) ? "text-orange-500" : ""}`}>
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
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } ${
                      isActive(item.path) 
                        ? "bg-green-100 text-orange-500" 
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setActiveItem(item.path);
                    }}
                  >
                    <span className={`text-xl ${isActive(item.path) ? "text-orange-500" : ""}`}>
                      {item.icon}
                    </span>
                    <span
                      className={`ml-4 text-base font-semibold transition-all duration-300 ${
                        isSidebarOpen ? "block" : "hidden"
                      } ${isActive(item.path) ? "text-orange-500" : ""}`}
                    >
                      {item.name}
                    </span>
                  </button>
                )}
              </li>
            ))}
            <li className="mt-6">
              <button
                className={`w-full flex items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300 ${
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
        <header className="bg-white shadow px-2 py-4 flex justify-between items-center">
          <MdMenuOpen
            className="text-3xl cursor-pointer bg-stone-100 rounded-md"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          />
          <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
            <button className="flex items-center space-x-2 focus:outline-none">
              <UserOutlined className="text-2xl text-gray-600" />
              <span className="text-gray-700">admin</span>
              <IoIosArrowDown className="text-xl text-gray-600" />
            </button>
          </Dropdown>
        </header>
        <main className="overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;