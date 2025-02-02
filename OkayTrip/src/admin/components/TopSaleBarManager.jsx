import { useState, useEffect } from "react";
import axios from "axios";

const TopSaleBarManager = () => {
  const [saleBars, setSaleBars] = useState([]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [active, setActive] = useState(false);

  const fetchSaleBars = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get("http://localhost:8000/api/admin/top-sale-bar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaleBars(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        "http://localhost:8000/api/admin/top-sale-bar/add-or-update",
        { message, startDate, endDate, active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSaleBars();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`http://localhost:8000/api/admin/top-sale-bar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSaleBars();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSaleBars();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Top Sale Bar Management</h2>
      <form
        onSubmit={handleAddOrUpdate}
        className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8"
      >
        <div>
          <label className="block font-medium mb-2">Message</label>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-medium">Active:</label>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-6 h-6 text-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          Add/Update
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Existing Sale Bars</h3>
        {saleBars.length > 0 ? (
          <ul>
            {saleBars.map((bar) => (
              <li
                key={bar._id}
                className="flex justify-between items-center p-3 border-b border-gray-200"
              >
                <div>
                  <p>{bar.message}</p>
                  <p>
                    {bar.startDate} - {bar.endDate}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(bar._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sale bars found.</p>
        )}
      </div>
    </div>
  );
};

export default TopSaleBarManager;
