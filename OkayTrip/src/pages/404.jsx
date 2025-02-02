import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="text-center">
        {/* SVG Illustration */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-64 h-64 mx-auto"
          fill="currentColor"
        >
          <path d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0zm0 480C123.303 480 32 388.697 32 256S123.303 32 256 32s224 91.303 224 224-91.303 224-224 224z" />
          <circle cx="176" cy="192" r="32" />
          <circle cx="336" cy="192" r="32" />
          <path d="M256 400c-44.112 0-80-35.888-80-80h32c0 26.472 21.528 48 48 48s48-21.528 48-48h32c0 44.112-35.888 80-80 80z" />
        </svg>

        {/* Text Section */}
        <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">
          Oops! The page you are looking for does not exist.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
