import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Typography, Card, Avatar, message } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  GiftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ViewCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/coupon/admin/coupons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const getStatusTag = (coupon) => {
    if (coupon.isWinner) {
      return (
        <Tag icon={<TrophyOutlined />} color="purple">
          Winner
        </Tag>
      );
    }
    if (coupon.offerId?.status === "ended" && coupon.offerId?.winnersAnnounced) {
      return (
        <Tag icon={<CloseCircleOutlined />} color="default">
          Closed
        </Tag>
      );
    }
    return coupon.paymentStatus === "success" ? (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Active
      </Tag>
    ) : (
      <Tag icon={<ClockCircleOutlined />} color="processing">
        Pending
      </Tag>
    );
  };

  const columns = [
    {
      title: (
        <Space>
          <ShoppingOutlined />
          <span>Coupon</span>
        </Space>
      ),
      dataIndex: "couponNumber",
      render: (num) => (
        <Text strong style={{ fontFamily: "monospace" }}>
          #{String(num).padStart(6, "0")}
        </Text>
      ),
      sorter: (a, b) => a.couponNumber - b.couponNumber,
    },
    {
      title: (
        <Space>
          <UserOutlined />
          <span>User</span>
        </Space>
      ),
      dataIndex: ["userId", "email"],
      render: (email, record) => (
        <Space>
          <Avatar
            size="small"
            src={record.userId?.avatar}
            icon={<UserOutlined />}
          />
          <Text>{email || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <GiftOutlined />
          <span>Offer</span>
        </Space>
      ),
      dataIndex: ["offerId", "title"],
      render: (title) => <Text>{title || "N/A"}</Text>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => getStatusTag(record),
      filters: [
        { text: "Active", value: "active" },
        { text: "Pending", value: "pending" },
        { text: "Winner", value: "winner" },
        { text: "Closed", value: "closed" },
      ],
      onFilter: (value, record) => {
        if (value === "active") return record.paymentStatus === "success";
        if (value === "pending") return record.paymentStatus !== "success";
        if (value === "winner") return record.isWinner;
        if (value === "closed")
          return (
            record.offerId?.status === "ended" && record.offerId?.winnersAnnounced
          );
        return true;
      },
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Purchase Date</span>
        </Space>
      ),
      dataIndex: "createdAt",
      render: (date) => (
        <Text type="secondary">
          {date ? new Date(date).toLocaleString() : "N/A"}
        </Text>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Package",
      dataIndex: ["associatedPackage", "title"],
      render: (title, record) =>
        record.isWinner ? (
          <Tag color="blue">{title || "Not assigned"}</Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  return (
    <div className="p-0">
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Coupon Management
          </Title>
        }
        bordered={false}
        className="shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={coupons}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => (
              <Text strong>{total} coupons found</Text>
            ),
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
          bordered
        />
      </Card>
    </div>
  );
};

export default ViewCoupons;