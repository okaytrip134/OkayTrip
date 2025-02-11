import React, { useEffect, useState } from "react";
import axios from "axios";
import PackageForm from "../components/PackageForm";

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]); // Safeguard: always initialized as an array
  const [filter, setFilter] = useState("all"); // all | active | inactive
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);
  const [limit] = useState(6); // Packages per page
  const [loading, setLoading] = useState(true); // Add loading state
  const adminToken = localStorage.getItem("adminToken");

  // Fetch packages
  const fetchPackages = async (page = 1) => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(`http://localhost:8000/api/admin/packages/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: { page, limit },
      });
      setPackages(data.packages || []); // Always ensure data is an array
      setFilteredPackages(data.packages || []); // Initially show all packages
      setTotalPackages(data.totalPackages || 0);
      setLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching packages:", error);
      setLoading(false); // End loading on error
    }
  };

  // Filter packages by status
  const filterPackages = (status) => {
    setFilter(status);
    if (status === "all") {
      setFilteredPackages(packages);
    } else {
      const isActive = status === "active";
      setFilteredPackages(packages.filter((pkg) => pkg.isActive === isActive));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/admin/packages/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchPackages(currentPage); // Refresh the package list
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  // Toggle package status
  const handleToggleStatus = async (id, isActive) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/packages/${id}/status`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      fetchPackages(currentPage); // Refresh the package list
    } catch (error) {
      console.error("Error toggling package status:", error);
    }
  };

  useEffect(() => {
    fetchPackages(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalPackages / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Packages</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedPackage(null);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Add Package
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => filterPackages("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
        >
          All
        </button>
        <button
          onClick={() => filterPackages("active")}
          className={`px-4 py-2 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
        >
          Active
        </button>
        <button
          onClick={() => filterPackages("inactive")}
          className={`px-4 py-2 rounded ${filter === "inactive" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
        >
          Inactive
        </button>
      </div>

      {loading ? (
        <p>Loading packages...</p>
      ) : (
        <div className="bg-white rounded shadow-md p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Title</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total Seats</th>
                <th className="border p-2">Available Seats</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages?.map((pkg) => (
              <tr key={pkg._id}>
              <td className="border p-2">{pkg.title}</td>
              <td className="border p-2">{pkg.categoryId?.name || "Unknown Category"}</td>
              <td className="border p-2">₹{pkg.discountedPrice}</td>
              <td className="border p-2">{pkg.totalSeats}</td>
              <td className="border p-2">
                <input
                  type="number"
                  min="0"
                  value={pkg.availableSeats}
                  readOnly
                  className="w-16 border p-1 rounded text-center"
                />
              </td>
              <td className="border p-2">{pkg.duration}</td>
              <td className="border p-2">{new Date(pkg.startDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(pkg.endDate).toLocaleDateString()}</td>
              <td className="border p-2">
                {pkg.isActive ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleToggleStatus(pkg._id, pkg.isActive)}
                  className={`px-2 py-1 text-sm font-medium rounded ${
                    pkg.isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {pkg.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowForm(true);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalPackages / limit)}
          </p>
          <button
            disabled={currentPage === Math.ceil(totalPackages / limit)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showForm && (
        <PackageForm
          onClose={() => setShowForm(false)}
          fetchPackages={() => fetchPackages(currentPage)}
          selectedPackage={selectedPackage}
        />
      )}
    </div>
  );
};

export default PackageManager;
