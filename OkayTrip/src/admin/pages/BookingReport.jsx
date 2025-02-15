import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Spin, Typography } from "antd";

const { Title, Text } = Typography;

const BookingReport = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/bookings`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          }
        );
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <Text copyable>{text}</Text>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount.toLocaleString()}`,
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="max-w-7xl mx-auto shadow-sm">
        <Title level={2} className="text-center mb-4">
          Booking Reports
        </Title>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center">
            <Text>No bookings found.</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        )}
      </Card>
    </div>
  );
};

export default BookingReport;
