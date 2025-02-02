import React, { useEffect, useState } from "react";

const TopSaleBar = () => {
  const [saleBar, setSaleBar] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch active sale bar details
  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/top-sale-bar/active`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No active sale bar");
        }
        return response.json();
      })
      .then((data) => {
        setSaleBar(data);
        calculateTimeLeft(data.endDate); // Initialize the timer
      })
      .catch(() => {
        // If no active sale bar, set saleBar and timeLeft to null
        setSaleBar(null);
        setTimeLeft(null);
      });
  }, []);

  // Timer logic
  useEffect(() => {
    if (!saleBar) return;

    const timer = setInterval(() => {
      calculateTimeLeft(saleBar.endDate);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [saleBar]);

  const calculateTimeLeft = (endDate) => {
    const endTime = new Date(endDate).getTime();
    const currentTime = new Date().getTime();
    const difference = endTime - currentTime;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    } else {
      // If the sale is expired, set timeLeft to null
      setTimeLeft(null);
    }
  };

  // If no active sale or the timer has expired, don't render the bar
  if (!saleBar || !timeLeft) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-2">
      <div className="container mx-auto flex justify-between items-center px-4 text-white font-semibold">
        {/* Sale Bar Message */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">{saleBar.message}</span>
          <div className="border-l-2 border-white h-6 mx-2"></div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-pink-600 px-3 py-1 rounded-md text-sm">
          {`${timeLeft.days} days : ${timeLeft.hours} hrs : ${timeLeft.minutes} min : ${timeLeft.seconds} sec`}
        </div>
      </div>
    </div>
  );
};

export default TopSaleBar;
