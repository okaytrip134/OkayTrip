import React, { useState, useEffect } from "react";

const SearchPopup = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productType, setProductType] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [includeFlights, setIncludeFlights] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [canSearch, setCanSearch] = useState(false);

  useEffect(() => {
    if (searchTerm || productType || tripDuration || includeFlights) {
      setCanSearch(true);
    } else {
      setCanSearch(false);
    }
  }, [searchTerm, productType, tripDuration, includeFlights]);

  const handleSearch = () => {
    if (!canSearch) return;
    const searchData = {
      searchTerm,
      productType,
      tripDuration,
      includeFlights,
      priceRange,
    };
    console.log("Search Data: ", searchData);
    alert(`Search initiated for: ${JSON.stringify(searchData)}`);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: parseInt(value, 10),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 mt-20 transform scale-90 opacity-0 animate-zoom-in"
        style={{
          animation: "zoom-in 0.3s ease-out forwards",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            document.querySelector(".animate-zoom-in").style.animation =
              "zoom-out 0.3s ease-in forwards";
            setTimeout(onClose, 300);
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>

        {/* Search Header */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">Search Destinations</h2>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border rounded-full shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Product Type */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Product Type</h3>
          <div className="flex space-x-4 mt-2">
            <button
              className={`px-6 py-2 border rounded-full ${
                productType === "Tour"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setProductType("Tour")}
            >
              Tour
            </button>
            <button
              className={`px-6 py-2 border rounded-full ${
                productType === "Activity"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setProductType("Activity")}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Trip Duration */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Trip Duration</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Upto 1 Day", "2 to 3 Days", "3 to 5 Days", "5 to 7 Days", "7+ Days"].map(
              (duration) => (
                <button
                  key={duration}
                  className={`px-4 py-2 border rounded-full ${
                    tripDuration === duration
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setTripDuration(duration)}
                >
                  {duration}
                </button>
              )
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Price Range</h3>
          <div className="flex items-center gap-4 mt-4">
            {/* Minimum Price */}
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="w-24 px-3 py-2 border rounded-lg text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="0"
              max={priceRange.max}
            />
            <span className="text-gray-500 font-medium">to</span>
            {/* Maximum Price */}
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-24 px-3 py-2 border rounded-lg text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              min={priceRange.min}
              max="500000"
            />
          </div>
          <div className="relative mt-4">
            <input
              type="range"
              min="0"
              max="500000"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ zIndex: 2 }}
            />
            <input
              type="range"
              min="0"
              max="500000"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ zIndex: 1 }}
            />
          </div>
          <div className="flex justify-between text-gray-500 text-sm mt-7">
            <span>Min INR {priceRange.min.toLocaleString()}</span>
            <span>Max INR {priceRange.max.toLocaleString()}</span>
          </div>
        </div>

        {/* Include Flights */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="include-flights"
            checked={includeFlights}
            onChange={() => setIncludeFlights(!includeFlights)}
            className="mr-2"
          />
          <label htmlFor="include-flights" className="text-gray-700">
            I want Flights to be included
          </label>
        </div>

        {/* Search Button */}
        <div className="text-center">
          <button
            onClick={handleSearch}
            className={`w-full px-6 py-3 rounded-full shadow-lg ${
              canSearch
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!canSearch}
          >
            Search for Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
