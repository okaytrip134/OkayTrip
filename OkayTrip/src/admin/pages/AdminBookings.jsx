import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Space,
    Card,
    Typography,
    Tag,
    message,
    Tooltip,
    Modal,
    Descriptions,
    Select,
    Divider,
    Form,
    DatePicker,
    Input
} from "antd";
import {
    DownloadOutlined,
    ReloadOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
    SearchOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Search } = Input;

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState("");
    const [filterForm] = Form.useForm();

    const fetchBookings = async (filterParams = {}) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings`,
                {
                    params: {
                        // Remove pagination parameters to fetch all bookings
                        limit: 1000, // Set a high limit to get all bookings
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
            title: 'Are you sure you want to cancel this booking?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await axios.put(
                        `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/cancel`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                        }
                    );
                    message.success("Booking cancelled successfully");
                    fetchBookings(filters);
                } catch (error) {
                    message.error("Failed to cancel booking");
                }
            },
        });
    };

    const handleDelete = async (bookingId) => {
        confirm({
            title: 'Are you sure you want to delete this booking?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await axios.delete(
                        `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings/${bookingId}/delete`,
                        {
                            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                        }
                    );
                    message.success("Booking deleted successfully");
                    fetchBookings(filters);
                } catch (error) {
                    message.error("Failed to delete booking");
                }
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

    const columns = [
        {
            title: "Booking Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) : "N/A",
        },
        {
            title: "Booking ID",
            dataIndex: "bookingId",
            key: "bookingId",
        },
        {
            title: "User",
            dataIndex: ["userId", "name"],
            key: "userName",
            render: (name) => name || "N/A",
        },
        {
            title: "Package",
            dataIndex: ["packageId", "title"],
            key: "package",
            render: (title) => title || "N/A",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.bookingId, value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="Pending">
                        <Tag color="gold">Pending</Tag>
                    </Select.Option>
                    <Select.Option value="Confirmed">
                        <Tag color="green">Confirmed</Tag>
                    </Select.Option>
                    <Select.Option value="Canceled">
                        <Tag color="red">Canceled</Tag>
                    </Select.Option>
                    <Select.Option value="Completed">
                        <Tag color="blue">Completed</Tag>
                    </Select.Option>
                </Select>
            ),
            filters: [
                { text: "Pending", value: "Pending" },
                { text: "Confirmed", value: "Confirmed" },
                { text: "Canceled", value: "Canceled" },
                { text: "Completed", value: "Completed" },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedBooking(record);
                            setIsModalVisible(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        danger
                        onClick={() => handleCancelBooking(record.bookingId)}
                        disabled={record.status === "Canceled"}
                    >
                        Cancel
                    </Button>
                    {/* <Button
                        danger
                        type="primary"
                        onClick={() => handleDelete(record.bookingId)}
                        disabled={record.status === "Canceled"}
                    >
                        Delete
                    </Button> */}
                </Space>
            ),
        },
    ];

    const handleFilter = async (values) => {
        const formattedFilters = {};

        if (values.dateRange) {
            formattedFilters.startDate = values.dateRange[0].format('YYYY-MM-DD');
            formattedFilters.endDate = values.dateRange[1].format('YYYY-MM-DD');
        }

        if (values.status) {
            formattedFilters.status = values.status;
        }

        if (values.paymentType) {
            formattedFilters.paymentType = values.paymentType;
        }

        if (values.search) {
            formattedFilters.search = values.search;
        }

        if (values.priceRange) {
            formattedFilters.minPrice = values.priceRange[0];
            formattedFilters.maxPrice = values.priceRange[1];
        }

        setFilters(formattedFilters);
        setIsFilterModalVisible(false);
    };

    const clearFilters = () => {
        filterForm.resetFields();
        setFilters({});
        setSearchText("");
        setIsFilterModalVisible(false);
    };

    const FilterModal = () => (
        <Modal
            title="Filter Bookings"
            open={isFilterModalVisible}
            onCancel={() => setIsFilterModalVisible(false)}
            footer={[
                <Button key="clear" onClick={clearFilters}>
                    Clear Filters
                </Button>,
                <Button key="apply" type="primary" onClick={() => filterForm.submit()}>
                    Apply Filters
                </Button>
            ]}
        >
            <Form
                form={filterForm}
                layout="vertical"
                onFinish={handleFilter}
                initialValues={filters}
            >
                <Form.Item name="dateRange" label="Booking Date Range">
                    <RangePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="status" label="Booking Status">
                    <Select allowClear>
                        <Select.Option value="Pending">Pending</Select.Option>
                        <Select.Option value="Confirmed">Confirmed</Select.Option>
                        <Select.Option value="Canceled">Canceled</Select.Option>
                        <Select.Option value="Completed">Completed</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="paymentType" label="Payment Type">
                    <Select allowClear>
                        <Select.Option value="Online">Online</Select.Option>
                        <Select.Option value="Cash">Cash</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="search" label="Search">
                    <Input placeholder="Search by booking ID, user name, or package" />
                </Form.Item>

                <Form.Item name="priceRange" label="Price Range">
                    <Input.Group compact>
                        <Input
                            style={{ width: '45%' }}
                            placeholder="Min Price"
                            type="number"
                        />
                        <Input
                            style={{ width: '45%', marginLeft: '10%' }}
                            placeholder="Max Price"
                            type="number"
                        />
                    </Input.Group>
                </Form.Item>
            </Form>
        </Modal>
    );

    return (
        <div className="p-0">
            <Card style={{ height: '100%', margin: 0 }} bodyStyle={{ padding: '0px', height: 'calc(100% - 2px)' }}>
                <div className="flex justify-between items-center mb-6 px-6">
                    <Title level={3}>Admin Booking Reports</Title>
                    <Space>
                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setIsFilterModalVisible(true)}
                        >
                            Filter
                        </Button>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadCSV}
                        >
                            Download Filtered Report
                        </Button>
                        <Tooltip title="Refresh Data">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => fetchBookings(filters)}
                            />
                        </Tooltip>
                    </Space>
                </div>

                {/* Search Bar */}
                <div className="mb-4 px-6">
                    <Search
                        placeholder="Search by booking ID, user name, email, phone, or package"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '100%', maxWidth: 600 }}
                    />
                </div>

                {/* Active Filters Display */}
                {(Object.keys(filters).length > 0 || searchText) && (
                    <div className="mb-4 px-6">
                        <Space wrap>
                            {searchText && (
                                <Tag closable onClose={() => setSearchText("")}>
                                    Search: {searchText}
                                </Tag>
                            )}
                            {Object.entries(filters).map(([key, value]) => (
                                <Tag key={key} closable onClose={() => {
                                    const newFilters = { ...filters };
                                    delete newFilters[key];
                                    setFilters(newFilters);
                                }}>
                                    {`${key}: ${value}`}
                                </Tag>
                            ))}
                            <Button size="small" onClick={clearFilters}>
                                Clear All
                            </Button>
                        </Space>
                    </div>
                )}

                {/* Total Count Display */}
                <div className="mb-4 px-6">
                    <Space>
                        <Title level={5} style={{ margin: 0 }}>
                            Total Bookings: {filteredBookings.length}
                        </Title>
                        {filteredBookings.length !== bookings.length && (
                            <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                                (Filtered from {bookings.length})
                            </Title>
                        )}
                    </Space>
                </div>

                <Table
                    columns={columns}
                    className=""
                    dataSource={filteredBookings}
                    rowKey="bookingId"
                    loading={loading}
                    pagination={false} // Disable pagination
                    scroll={{ 
                        x: true,
                        y: 'calc(100vh - 350px)' // Reduced from 400px to accommodate the reduced padding
                    }}
                    size="middle"
                />
            </Card>

            <FilterModal />

            <Modal
                title="Booking Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                {selectedBooking && (
                    <>
                        <Title level={5}>Booking Information</Title>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Booking ID" span={2}>
                                {selectedBooking.bookingId}
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment ID" span={2}>
                                {selectedBooking.paymentId}
                            </Descriptions.Item>
                            <Descriptions.Item label="Booking Date" span={2}>
                                {new Date(selectedBooking.createdAt).toLocaleString('en-IN')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={
                                    selectedBooking.status === "Confirmed" ? "green" :
                                        selectedBooking.status === "Pending" ? "gold" :
                                            selectedBooking.status === "Canceled" ? "red" : "blue"
                                }>
                                    {selectedBooking.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Type">
                                <Tag color="blue">{selectedBooking.paymentType}</Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />
                        <Title level={5}>Customer Information</Title>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="User Name">
                                {selectedBooking.userId?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="User Email">
                                {selectedBooking.userId?.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="User Phone">
                                {selectedBooking.userId?.phone}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />
                        <Title level={5}>Package Details</Title>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Package Title" span={2}>
                                {selectedBooking.packageId?.title}
                            </Descriptions.Item>
                            <Descriptions.Item label="Package Duration">
                                {selectedBooking.packageId?.duration}
                            </Descriptions.Item>
                            <Descriptions.Item label="Amount Paid">
                                ₹{selectedBooking.amount}
                            </Descriptions.Item>
                            <Descriptions.Item label="Real Price">
                                ₹{selectedBooking.packageId?.realPrice}
                            </Descriptions.Item>
                            <Descriptions.Item label="Discounted Price">
                                ₹{selectedBooking.packageId?.discountedPrice}
                            </Descriptions.Item>
                            <Descriptions.Item label="Start Date">
                                {selectedBooking.packageId?.startDate ?
                                    new Date(selectedBooking.packageId.startDate).toLocaleDateString() :
                                    "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="End Date">
                                {selectedBooking.packageId?.endDate ?
                                    new Date(selectedBooking.packageId.endDate).toLocaleDateString() :
                                    "N/A"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />
                        <Title level={5}>Traveler Details</Title>
                        <Descriptions bordered column={2}>
                            {selectedBooking.travelers?.map((traveler, index) => (
                                <React.Fragment key={index}>
                                    <Descriptions.Item label="Name">
                                        {traveler.name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Aadhar">
                                        {traveler.aadhar}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Age">
                                        {traveler.age}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Gender">
                                        {traveler.gender}
                                    </Descriptions.Item>
                                    {index < selectedBooking.travelers.length - 1 && (
                                        <Descriptions.Item span={2}>
                                            <Divider className="my-2" />
                                        </Descriptions.Item>
                                    )}
                                </React.Fragment>
                            ))}
                        </Descriptions>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AdminBookings;