import axios from "axios";

const API_URL = `${import.meta.env.VITE_APP_API_URL}/api/admin/blogs`;

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getBlogsAdmin = async () => {
  try {
    const response = await api.get("/admin");
    return response.data.blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error.response?.data?.message || "Failed to fetch blogs";
  }
};

const createBlog = async (formData) => {
  try {
    const response = await api.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error.response?.data?.message || "Failed to create blog";
  }
};

const updateBlog = async (id, formData) => {
  try {
    const response = await api.put(`/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error.response?.data?.message || "Failed to update blog";
  }
};

const deleteBlog = async (id) => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error.response?.data?.message || "Failed to delete blog";
  }
};

export { getBlogsAdmin, createBlog, updateBlog, deleteBlog };