import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Space,
    Select,
    Card,
    Typography,
    Tag,
    message,
    Tooltip
} from "antd";
import {
    DownloadOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import { Modal } from 'antd';

const { Title } = Typography;
const { confirm } = Modal;

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 7,
        total: 0,
    });

    const fetchBookings = async (page = 1, pageSize = 7) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `http://localhost:8000/api/admin/bookings`,
                {
                    params: {
                        page,
                        limit: pageSize,
                    },
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );

            setBookings(data.bookings);
            setPagination({
                ...pagination,
                total: data.totalPages * pageSize,
                current: page,
            });
        } catch (error) {
            message.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8000/api/admin/bookings/${bookingId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );

            message.success(`Booking status updated to ${newStatus}`);
            fetchBookings(pagination.current);
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
                        `http://localhost:8000/api/admin/bookings/${bookingId}/cancel`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                        }
                    );

                    message.success("Booking cancelled successfully");
                    fetchBookings(pagination.current);
                } catch (error) {
                    message.error("Failed to cancel booking");
                }
            },
        });
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/admin/bookings/download",
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "bookings_report.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Report downloaded successfully");
        } catch (error) {
            message.error("Failed to download report");
        }
    };
    // Delete Booking Function
    const handleDelete = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/bookings/${bookingId}/delete`);
            message.success("Booking deleted successfully!");
            setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
        } catch (error) {
            console.error("Error deleting booking:", error);
            message.error("Failed to delete booking.");
        }
    };
    const columns = [
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
            title: "Booking Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : "N/A",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `₹${amount}`,
        },
        {
            title: "Payment Type",
            dataIndex: "paymentType",
            key: "paymentType",
            render: (type) => <Tag color="blue">{type}</Tag>,
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
                        danger
                        type="primary"
                        onClick={() => handleCancelBooking(record.bookingId)}
                        disabled={record.status === "Canceled"}
                    >
                        Cancel
                    </Button>
                    <Button
                        danger
                        type="primary"
                        onClick={() => handleDelete(record.bookingId)}
                        disabled={record.status === "Canceled"}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <Title level={3}>Admin Booking Reports</Title>
                    <Space>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadCSV}
                        >
                            Download Report
                        </Button>
                        <Tooltip title="Refresh Data">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => fetchBookings(pagination.current)}
                            />
                        </Tooltip>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey="bookingId"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (page, pageSize) => {
                            fetchBookings(page, pageSize);
                        },
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} bookings`,
                    }}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default AdminBookings;