import React, { useEffect, useState } from "react";
import { fetchAllUsers, deleteUser } from "../../api/admin";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchAllUsers(); // Call API from admin.js
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await deleteUser(userId); // Call delete API from admin.js
      setUsers(users.filter((user) => user._id !== userId)); // Update state to remove deleted user
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err.message || err);
      alert(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone || "N/A"}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
