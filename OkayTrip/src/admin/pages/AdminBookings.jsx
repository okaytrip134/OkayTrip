import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import { 
    Search, 
    Download, 
    RefreshCw, 
    Eye, 
    X, 
    Filter,
    Trash2
} from "lucide-react";

const { confirm } = Modal;

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState("");

    const fetchBookings = async (filterParams = {}) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings`,
                {
                    params: {
                        limit: 1000,
                        ...filterParams
                    },
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );

            setBookings(data.bookings);
            setFilteredBookings(data.bookings);
        } catch (error) {
            message.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(filters);
    }, [filters]);

    useEffect(() => {
        fetchBookings();
    }, []);

    // Handle search functionality
    useEffect(() => {
        if (!searchText) {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter(booking =>
                booking.bookingId?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.packageId?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.userId?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.userId?.phone?.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
    }, [searchText, bookings]);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );
            message.success(`Booking status updated to ${newStatus}`);
            fetchBookings(filters);
        } catch (error) {
            message.error("Failed to update booking status");
        }
    };

    const handleCancelBooking = (bookingId) => {
        confirm({
            title: 'Cancel Booking',
            content: 'Are you sure you want to cancel this booking? This action cannot be undone.',
            okText: 'Yes, Cancel',
            cancelText: 'No',
            okType: 'danger',
            centered: true,
            onOk() {
                return axios.put(
                    `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/cancel`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                    }
                ).then(() => {
                    message.success("Booking cancelled successfully");
                    fetchBookings(filters);
                }).catch(() => {
                    message.error("Failed to cancel booking");
                });
            },
        });
    };

    const handleDelete = async (bookingId) => {
        confirm({
            title: 'Delete Booking',
            content: 'Are you sure you want to delete this booking? This action cannot be undone.',
            okText: 'Yes, Delete',
            cancelText: 'No',
            okType: 'danger',
            centered: true,
            onOk() {
                return axios.delete(
                    `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/delete`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                    }
                ).then(() => {
                    message.success("Booking deleted successfully");
                    fetchBookings(filters);
                }).catch(() => {
                    message.error("Failed to delete booking");
                });
            },
        });
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/download`,
                {
                    params: { ...filters, search: searchText },
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "filtered_bookings_report.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Filtered report downloaded successfully");
        } catch (error) {
            message.error("Failed to download report");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Canceled': return 'bg-red-100 text-red-800';
            case 'Completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const clearFilters = () => {
        setFilters({});
        setSearchText("");
        setIsFilterModalVisible(false);
    };

    const FilterModal = () => {
        if (!isFilterModalVisible) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-semibold mb-4">Filter Bookings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Search</label>
                            <input 
                                type="text" 
                                placeholder="Search by booking ID, user name, or package"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                        <button 
                            onClick={clearFilters}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                        <button 
                            onClick={() => setIsFilterModalVisible(false)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const BookingModal = () => {
        if (!isModalVisible || !selectedBooking) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Booking Details</h3>
                        <button 
                            onClick={() => setIsModalVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Booking Information */}
                        <div>
                            <h4 className="font-semibold mb-2">Booking Information</h4>
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div><strong>Booking ID:</strong> {selectedBooking.bookingId}</div>
                                <div><strong>Payment ID:</strong> {selectedBooking.paymentId}</div>
                                <div><strong>Booking Date:</strong> {new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</div>
                                <div>
                                    <strong>Status:</strong> 
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                                <div><strong>Payment Type:</strong> {selectedBooking.paymentType}</div>
                                <div><strong>Amount:</strong> ₹{selectedBooking.amount}</div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div>
                            <h4 className="font-semibold mb-2">Customer Information</h4>
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div><strong>Name:</strong> {selectedBooking.userId?.name}</div>
                                <div><strong>Email:</strong> {selectedBooking.userId?.email}</div>
                                <div><strong>Phone:</strong> {selectedBooking.userId?.phone}</div>
                            </div>
                        </div>

                        {/* Package Details */}
                        <div>
                            <h4 className="font-semibold mb-2">Package Details</h4>
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="col-span-2"><strong>Title:</strong> {selectedBooking.packageId?.title}</div>
                                <div><strong>Duration:</strong> {selectedBooking.packageId?.duration}</div>
                                <div><strong>Real Price:</strong> ₹{selectedBooking.packageId?.realPrice}</div>
                                <div><strong>Discounted Price:</strong> ₹{selectedBooking.packageId?.discountedPrice}</div>
                                <div><strong>Start Date:</strong> {selectedBooking.packageId?.startDate ? new Date(selectedBooking.packageId.startDate).toLocaleDateString() : "N/A"}</div>
                                <div><strong>End Date:</strong> {selectedBooking.packageId?.endDate ? new Date(selectedBooking.packageId.endDate).toLocaleDateString() : "N/A"}</div>
                            </div>
                        </div>

                        {/* Traveler Details */}
                        {selectedBooking.travelers && selectedBooking.travelers.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Traveler Details</h4>
                                <div className="space-y-4">
                                    {selectedBooking.travelers.map((traveler, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div><strong>Name:</strong> {traveler.name}</div>
                                            <div><strong>Aadhar:</strong> {traveler.aadhar}</div>
                                            <div><strong>Age:</strong> {traveler.age}</div>
                                            <div><strong>Gender:</strong> {traveler.gender}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <button 
                            onClick={() => setIsModalVisible(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Booking Reports</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsFilterModalVisible(true)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Filter size={16} />
                        Filter
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Download size={16} />
                        Download CSV
                    </button>
                    <button
                        onClick={() => fetchBookings(filters)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by booking ID, user name, email, phone, or package"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full max-w-2xl pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Active Filters */}
            {(Object.keys(filters).length > 0 || searchText) && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {searchText && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Search: {searchText}
                                <button 
                                    onClick={() => setSearchText("")}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {Object.entries(filters).map(([key, value]) => (
                            <span key={key} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {key}: {value}
                                <button 
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        delete newFilters[key];
                                        setFilters(newFilters);
                                    }}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        <button 
                            onClick={clearFilters}
                            className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Total Count */}
            <div className="mb-4">
                <div className="text-lg font-medium">
                    Total Bookings: {filteredBookings.length}
                    {filteredBookings.length !== bookings.length && (
                        <span className="text-blue-600 ml-2">
                            (Filtered from {bookings.length})
                        </span>
                    )}
                </div>
            </div>

            {/* Custom Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-auto max-h-[70vh]">
                    <table className="w-full">
                        <thead className="bg-gray-800 text-white sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left border-r border-gray-600">Booking Date</th>
                                <th className="px-4 py-3 text-left border-r border-gray-600">Booking ID</th>
                                <th className="px-4 py-3 text-left border-r border-gray-600">User</th>
                                <th className="px-4 py-3 text-left border-r border-gray-600">Package</th>
                                <th className="px-4 py-3 text-left border-r border-gray-600">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking, index) => (
                                    <tr 
                                        key={booking.bookingId} 
                                        className={`border-b border-gray-200  ${
                                            index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                                        }`}
                                    >
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300 font-mono text-sm">
                                            {booking.bookingId}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {booking.userId?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            {booking.packageId?.title || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs border-none ${getStatusColor(booking.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Canceled">Canceled</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setIsModalVisible(true);
                                                    }}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                                    disabled={booking.status === "Canceled"}
                                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                                                        booking.status === "Canceled" 
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                            : 'bg-red-500 text-white hover:bg-red-600'
                                                    }`}
                                                >
                                                    <X size={14} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FilterModal />
            <BookingModal />
        </div>
    );
};

export default AdminBookings;