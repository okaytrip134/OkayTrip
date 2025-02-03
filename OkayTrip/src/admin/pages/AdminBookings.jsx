import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const bookingsPerPage = 7; // ✅ Limit to 7 bookings per page

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings?page=${currentPage}&limit=${bookingsPerPage}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                    }
                );
                setBookings(data.bookings);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentPage]);

    // ✅ Handle Pagination
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    // ✅ Handle Status Update
    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/status`, // Fixed route
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
                )
            );
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    };

    // ✅ Handle Booking Cancellation
    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/cancel`, // Fixed cancellation route
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.bookingId === bookingId ? { ...booking, status: "Canceled" } : booking
                )
            );
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };

    // ✅ Handle CSV Download
    const handleDownloadCSV = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/download`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "bookings_report.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Booking Reports</h1>

            {/* ✅ CSV Download Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
                onClick={handleDownloadCSV}
            >
                Download CSV
            </button>

            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                <>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Booking ID</th>
                                <th className="border p-2">User</th>
                                <th className="border p-2">Package</th>
                                <th className="border p-2">Amount</th>
                                <th className="border p-2">Payment Type</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="text-center">
                                    <td className="border p-2">{booking.bookingId}</td>
                                    <td className="border p-2">{booking.userId?.name || "N/A"}</td>
                                    <td className="border p-2">{booking.packageId?.title || "N/A"}</td>
                                    <td className="border p-2">₹{booking.amount}</td>
                                    <td className="border p-2">{booking.paymentType}</td>
                                    <td className="border p-2">
                                        <select
                                            className="p-2 border rounded"
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Canceled">Canceled</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleCancelBooking(booking.bookingId)}
                                        >
                                            Cancel Booking
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="bg-gray-500 text-white px-4 py-2 mx-2 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="mx-4">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="bg-gray-500 text-white px-4 py-2 mx-2 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminBookings;
