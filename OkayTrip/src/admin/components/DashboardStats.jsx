import React from "react";

const DashboardStats = () => {
  const stats = [
    { label: "Total Bookings", value: 1000, color: "bg-green-100", icon: "🛒" },
    { label: "Total Users", value: 500, color: "bg-blue-100", icon: "👤" },
    { label: "Total Tours", value: 200, color: "bg-yellow-100", icon: "✈️" },
    { label: "Total Categories", value: 70, color: "bg-pink-100", icon: "📦" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-md ${stat.color}`}
        >
          <div className="text-3xl">{stat.icon}</div>
          <div className="text-xl font-semibold">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
