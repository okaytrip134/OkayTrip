import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingTable from "../components/BookingTable";

const BookingReport = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setBookings(data.bookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Reports</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <BookingTable bookings={bookings} />
      )}
    </div>
  );
};

export default BookingReport;
