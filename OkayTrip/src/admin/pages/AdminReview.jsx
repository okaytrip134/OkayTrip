import React, { useEffect, useState } from "react";
import { 
  Table, 
  Typography, 
  Input, 
  Button, 
  message, 
  Popconfirm,
  Space,
  Card,
  Tag
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined, 
  SaveOutlined,   
  CloseOutlined,
  MessageOutlined
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/reviews/all`, 
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setReviews(data.reviews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      message.error("Failed to fetch reviews");
      setLoading(false);
    }
  };

  const handleUpdateResponse = async () => {
    if (!editingReview) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/reviews/${editingReview._id}`,
        { adminResponse },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      message.success("Response updated successfully!");
      fetchReviews();
      setEditingReview(null);
      setAdminResponse("");
    } catch (error) {
      console.error("Error updating response:", error);
      message.error("Failed to update response");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/reviews/${reviewId}`, 
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Review deleted successfully!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Failed to delete review");
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: '15%',
      render: (userName) => (
        <Space>
          <MessageOutlined style={{ color: '#1890ff' }} />
          <Text strong style={{ color: '#1890ff' }}>
            {userName || 'Anonymous'}
          </Text>
        </Space>
      )
    },
    {
      title: 'Review',
      dataIndex: 'reviewText',
      key: 'reviewText',
      width: 500, // ✅ Set a fixed width for proper alignment
      render: (reviewText) => (
        <Card 
          size="small" 
          style={{ 
            background: '#f5f5f5', 
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            maxWidth: '400px', // ✅ Limits how wide the text box can be
            wordWrap: 'break-word', // ✅ Ensures long words wrap correctly
            overflow: 'hidden', // ✅ Prevents content from overflowing
            textOverflow: 'ellipsis', // ✅ Adds "..." for long text
            whiteSpace: 'normal', // ✅ Allows multi-line wrapping
          }}
        >
          <Text>{reviewText}</Text>
        </Card>
      )
    },
    {
      title: 'Admin Response',
      key: 'adminResponse',
      width: '25%',
      render: (_, record) => {
        if (editingReview && editingReview._id === record._id) {
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <TextArea 
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Write your response here"
                rows={3}
                style={{
                  borderColor: 'black',
                  boxShadow: '0 0 5px rgba(64, 169, 255, 0.3)',
                  borderRadius: '6px'
                }}
              />
              <Space>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleUpdateResponse}
                >
                  Save
                </Button>
                <Button 
                  icon={<CloseOutlined />} 
                  onClick={() => {
                    setEditingReview(null);
                    setAdminResponse("");
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Space>
          );
        }
        
        return (
          <Space direction="vertical">
            <Card 
              size="small" 
              style={{ 
                background: record.adminResponse ? '#f6ffed' : '#fff1f0', 
                borderRadius: '4px',
                padding: '10px'
              }}
            >
              <Text ellipsis={{ tooltip: record.adminResponse || 'No response' }} type={record.adminResponse ? 'success' : 'danger'}>
                {record.adminResponse || 'No response provided'}
              </Text>
            </Card>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => {
                setEditingReview(record);
                setAdminResponse(record.adminResponse || "");
              }}
            >
              Edit Response
            </Button>
          </Space>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Popconfirm
            title="Are you sure you want to delete this review?"
            onConfirm={() => handleDeleteReview(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="default" 
              danger 
              icon={<DeleteOutlined />}
              block
            >
              Delete Review
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ 
      padding: '0px', 
      background: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <Card 
        style={{ 
          maxWidth: '1440px', 
          margin: '0 auto',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <Title 
          level={2} 
          style={{ 
            marginBottom: '24px', 
            textAlign: 'center',
            color: '#1890ff'
          }}
        >
          Review Management Dashboard
        </Title>

        <Table 
          columns={columns}
          dataSource={reviews}
          loading={loading}
          rowKey="_id"
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} reviews`
          }}
          style={{ 
            background: 'white', 
            borderRadius: '8px' 
          }}
        />
      </Card>
    </div>
  );
};

export default AdminReviews;
