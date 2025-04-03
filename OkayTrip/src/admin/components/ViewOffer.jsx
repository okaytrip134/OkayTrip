import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Typography, Card, Button, message, Popconfirm } from "antd";
import {
  FireOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ViewOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/offer/view-offers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();
        const formattedOffers = data.map(offer => ({
          ...offer,
          price: offer.price || 0,
          totalCoupons: offer.totalCoupons || 0,
          status: offer.status || 'ended',
          bannerImage: offer.bannerImage || '/uploads/default-offer.jpg' // Default image
        }));
        setOffers(formattedOffers);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleEndOffer = async (offerId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/offer/end-offer/${offerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to end offer");
      }

      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer._id === offerId ? { ...offer, status: "ended" } : offer
        )
      );
      message.success("Offer ended successfully!");
    } catch (error) {
      message.error(error.message);
    }
  };

  const getStatusTag = (status) => {
    return status === "live" ? (
      <Tag icon={<CheckCircleOutlined />} color="green">
        LIVE
      </Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="red">
        ENDED
      </Tag>
    );
  };

  const columns = [
    {
      title: (
        <Space>
          <FireOutlined />
          <span>Offer Title</span>
        </Space>
      ),
      dataIndex: "title",
      render: (text) => <Text strong>{text || 'Untitled Offer'}</Text>,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
    },
    {
      title: (
        <Space>
          <PictureOutlined />
          <span>Banner</span>
        </Space>
      ),
      dataIndex: "bannerImage",
      render: (imagePath) => (
        <div className="w-24 h-16 overflow-hidden rounded-md">
          <img
            src={`${import.meta.env.VITE_APP_API_URL}${imagePath}`}
            alt="Offer banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `${import.meta.env.VITE_APP_API_URL}/uploads/default-offer.jpg`;
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Space>
          <ShoppingCartOutlined />
          <span>Coupons</span>
        </Space>
      ),
      dataIndex: "totalCoupons",
      render: (count) => <Text>{count || 0}</Text>,
      sorter: (a, b) => (a.totalCoupons || 0) - (b.totalCoupons || 0),
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          <span>Price</span>
        </Space>
      ),
      dataIndex: "price",
      render: (price) => (
        <Text strong>
          ₹{(price || 0).toLocaleString("en-IN")}
        </Text>
      ),
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>End Date</span>
        </Space>
      ),
      dataIndex: "endDate",
      render: (date) => (
        <Text>
          {date ? new Date(date).toLocaleDateString() : 'Not specified'}
        </Text>
      ),
      sorter: (a, b) => new Date(a.endDate || 0) - new Date(b.endDate || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Live", value: "live" },
        { text: "Ended", value: "ended" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "live" && (
            <Popconfirm
              title="Are you sure to end this offer?"
              onConfirm={() => handleEndOffer(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<PoweroffOutlined />}
                size="small"
              >
                End Offer
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Manage Offers
          </Title>
        }
        bordered={false}
        className="shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={offers}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => (
              <Text strong>{total} offers found</Text>
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

export default ViewOffers;