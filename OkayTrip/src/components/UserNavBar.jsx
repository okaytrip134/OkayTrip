import React from "react";
import logo from "../assets/Logo/Trip ok new 2 black-01.png"; // Replace with your logo path

const Navbar = ({ profileMode }) => {
  const userName = localStorage.getItem("userName");

  return (
    <nav className="flex items-center justify-between bg-white shadow-md px-6 py-3">
      <img src={logo} alt="Logo" className="h-8" />
      <div>
        {profileMode && (
          <div className="flex items-center space-x-2">
            <span className="font-bold">{userName}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
