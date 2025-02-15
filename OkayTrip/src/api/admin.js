import axios from "axios";

export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("No admin token found!");

    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message || error);
    throw error.response?.data || "Error fetching users";
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("No admin token found!");

    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/admin/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.message || error);
    throw error.response?.data || "Error deleting user";
  }
};
