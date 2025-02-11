import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [svgFile, setSvgFile] = useState(null);
  const [isTrending, setIsTrending] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch admin token from localStorage
  const adminToken = localStorage.getItem("adminToken");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/?isAdmin=true`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to fetch categories.");
    }
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!svgFile) {
      setMessage("Please upload an SVG file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("svgFile", svgFile);
    formData.append("isTrending", isTrending);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setMessage(data.message);
      fetchCategories();
      setName("");
      setSvgFile(null);
      setIsTrending(false);
    } catch (error) {
      console.error("Error creating category:", error);
      setMessage("Failed to create category.");
    }
  };

  // Toggle category status (active/inactive)
  const handleToggleCategory = async (id, isActive) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/${id}/status`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setMessage(data.message);
      fetchCategories();
    } catch (error) {
      console.error("Error toggling category status:", error);
      setMessage("Failed to update category status.");
    }
  };

  // Toggle trending status
  const handleToggleTrending = async (id, isTrending) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/${id}/trending`,
        { isTrending: !isTrending },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setMessage(data.message);
      fetchCategories();
    } catch (error) {
      console.error("Error toggling trending status:", error);
      setMessage("Failed to update trending status.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setMessage(data.message);
      toast.success("Category Deleted.");

      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Failed to delete category.");
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" /> {/* Toast Notification Container */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Categories</h1>
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Create New Category</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="border p-2 rounded w-1/3"
          />
          <input
            type="file"
            accept=".svg"
            onChange={(e) => setSvgFile(e.target.files[0])}
            className="border p-2 rounded w-1/3"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
            />
            <span>Trending</span>
          </label>
          <button
            onClick={handleCreateCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Existing Categories</h2>
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category._id} className="flex justify-between items-center py-4">
              <div>
                <p className="font-medium text-gray-800">{category.name}</p>
                <p className="text-sm text-gray-500">
                  Status: {category.isActive ? "Active" : "Inactive"} | Trending:{" "}
                  {category.isTrending ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleToggleTrending(category._id, category.isTrending)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    category.isTrending ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-800"
                  } hover:opacity-90`}
                >
                  {category.isTrending ? "Remove Trending" : "Make Trending"}
                </button>
                <button
                  onClick={() => handleToggleCategory(category._id, category.isActive)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    category.isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  } hover:opacity-90`}
                >
                  {category.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
