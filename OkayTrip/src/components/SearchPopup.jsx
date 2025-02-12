import React, { useState, useEffect } from "react";
import { Calendar, Search, X, Plane, PlaneTakeoff } from "lucide-react";

const SearchPopup = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [includeFlights, setIncludeFlights] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [canSearch, setCanSearch] = useState(false);

  useEffect(() => {
    if (searchTerm || startDate || endDate || tripDuration || includeFlights) {
      setCanSearch(true);
    } else {
      setCanSearch(false);
    }
  }, [searchTerm, startDate, endDate, tripDuration, includeFlights]);

  const handleSearch = () => {
    if (!canSearch) return;
    const searchData = {
      searchTerm,
      dateRange: { startDate, endDate },
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm">
      <div
        className=" bg-white rounded-2xl shadow-2xl w-11/12 max-w-2xl p-8 mt-4 transform scale-90 opacity-0 animate-zoom-in"
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
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Search Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Trip</h2>

        {/* Search Box */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Date Range */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-0 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-500" />
            Travel Dates
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-0">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-0">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Trip Duration */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800">Duration Preference</h3>
          <div className="flex flex-wrap gap-2">
            {["Upto 1 Day", "2 to 3 Days", "3 to 5 Days", "5 to 7 Days", "7+ Days"].map(
              (duration) => (
                <button
                  key={duration}
                  className={`px-6 py-3 border-2 rounded-xl font-medium transition-all ${
                    tripDuration === duration
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
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
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget Range</h3>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="w-32 px-4 py-3 border-2 rounded-xl text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              min="0"
              max={priceRange.max}
            />
            <span className="text-gray-400 font-medium">to</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-32 px-4 py-3 border-2 rounded-xl text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              min={priceRange.min}
              max="500000"
            />
          </div>
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-orange-500 rounded-full"
                style={{
                  left: `${(priceRange.min / 500000) * 100}%`,
                  right: `${100 - (priceRange.max / 500000) * 100}%`,
                }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ zIndex: 2 }}
            />
            <input
              type="range"
              min="0"
              max="500000"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ zIndex: 1 }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹{priceRange.min.toLocaleString()}</span>
            <span>₹{priceRange.max.toLocaleString()}</span>
          </div>
        </div>

        {/* Include Flights */}
        <div className="mb-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id="include-flights"
                checked={includeFlights}
                onChange={() => setIncludeFlights(!includeFlights)}
                className="sr-only"
              />
              <div className={`w-6 h-6 border-2 rounded-lg transition-all ${includeFlights ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                {includeFlights && (
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <PlaneTakeoff className={`h-5 w-5 ${includeFlights ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`font-medium ${includeFlights ? 'text-gray-800' : 'text-gray-600'}`}>
                Include Flights in Search
              </span>
            </div>
          </label>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!canSearch}
          className={`w-full px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all ${
            canSearch
              ? 'bg-orange-500 text-white hover:bg-orange-600 transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Search Trips
        </button>
      </div>
    </div>
  );
};

export default SearchPopup;