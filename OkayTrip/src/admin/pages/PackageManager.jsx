import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Dropdown,
  Radio,
  Spin,
  message,
  Popconfirm,
  Menu,
  Badge
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined
} from "@ant-design/icons";
import PackageForm from "../components/PackageForm";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | inactive
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });
  const adminToken = localStorage.getItem("adminToken");
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Fetch packages
  const fetchPackages = async (params = {}) => {
    setLoading(true);
    try {
      const { page = pagination.current, pageSize = pagination.pageSize } = params;
      
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/packages/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: { page, limit: pageSize },
      });
      
      setPackages(data.packages || []);
      setPagination({
        ...pagination,
        current: page,
        total: data.totalPackages || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Failed to load packages");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle table change (pagination, filters, sorting)
  const handleTableChange = (paginationData) => {
    fetchPackages({
      page: paginationData.current,
      pageSize: paginationData.pageSize,
    });
  };

  // Filter packages by status
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
  };

  // Delete package
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/admin/packages/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      message.success("Package deleted successfully");
      fetchPackages({ page: pagination.current });
    } catch (error) {
      console.error("Error deleting package:", error);
      message.error("Failed to delete package");
    }
  };

  // Toggle package status
  const handleToggleStatus = async (id, isActive) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/${id}/status`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      message.success(`Package ${isActive ? "deactivated" : "activated"} successfully`);
      fetchPackages({ page: pagination.current });
    } catch (error) {
      console.error("Error toggling package status:", error);
      message.error("Failed to update package status");
    }
  };

  // Filter data based on selected filter
  const getFilteredData = () => {
    if (filter === "all") return packages;
    const isActive = filter === "active";
    return packages.filter((pkg) => pkg.isActive === isActive);
  };

  const columns = [
    {
      title: "Package",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{text}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {record.categoryId?.name || "Uncategorized"}
          </Typography.Text>
        </Space>
      ),
      fixed: isMobile ? 'left' : false,
    },
    {
      title: "Price",
      dataIndex: "discountedPrice",
      key: "price",
      render: (price) => `₹${price}`,
      responsive: ['md'],
    },
    {
      title: "Seats",
      dataIndex: "totalSeats",
      key: "seats",
      render: (totalSeats, record) => (
        <Space>
          <Badge status={record.availableSeats > 0 ? "success" : "error"} />
          {record.availableSeats}/{totalSeats}
        </Space>
      ),
      responsive: ['md'],
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      responsive: ['lg'],
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontSize: '12px' }}>
            Start: {new Date(record.startDate).toLocaleDateString()}
          </Typography.Text>
          <Typography.Text style={{ fontSize: '12px' }}>
            End: {new Date(record.endDate).toLocaleDateString()}
          </Typography.Text>
        </Space>
      ),
      responsive: ['lg'],
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: isMobile ? 'right' : false,
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item 
              key="edit" 
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPackage(record);
                setShowForm(true);
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item 
              key="status" 
              icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record._id, record.isActive)}
            >
              {record.isActive ? "Deactivate" : "Activate"}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item 
              key="delete" 
              danger 
              icon={<DeleteOutlined />}
            >
              <Popconfirm
                title="Are you sure you want to delete this package?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                Delete
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return isMobile ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ) : (
          <Space>
            <Button 
              type="primary" 
              ghost
              icon={<EditOutlined />} 
              size="small"
              onClick={() => {
                setSelectedPackage(record);
                setShowForm(true);
              }}
            >
              Edit
            </Button>
            <Button
              type={record.isActive ? "danger" : "success"}
              ghost
              size="small"
              icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record._id, record.isActive)}
            >
              {record.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this package?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Mobile card view component
  const MobileCardView = ({ data }) => (
    <div className="space-y-4">
      {data.map((pkg) => (
        <Card 
          key={pkg._id} 
          size="small"
          className="shadow-sm"
          extra={
            <Dropdown overlay={
              <Menu>
                <Menu.Item 
                  key="edit" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item 
                  key="status" 
                  icon={pkg.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                  onClick={() => handleToggleStatus(pkg._id, pkg.isActive)}
                >
                  {pkg.isActive ? "Deactivate" : "Activate"}
                </Menu.Item>
                <Menu.Item 
                  key="delete" 
                  danger 
                  icon={<DeleteOutlined />}
                >
                  <Popconfirm
                    title="Are you sure you want to delete this package?"
                    onConfirm={() => handleDelete(pkg._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    Delete
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            } trigger={["click"]}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          }
          title={
            <Space align="center">
              <Typography.Text strong>{pkg.title}</Typography.Text>
              <Tag color={pkg.isActive ? "success" : "error"}>
                {pkg.isActive ? "Active" : "Inactive"}
              </Tag>
            </Space>
          }
        >
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Typography.Text type="secondary">Category:</Typography.Text>
              <div>{pkg.categoryId?.name || "Uncategorized"}</div>
            </Col>
            <Col span={12}>
              <Typography.Text type="secondary">Price:</Typography.Text>
              <div>₹{pkg.discountedPrice}</div>
            </Col>
            <Col span={12}>
              <Typography.Text type="secondary">Seats:</Typography.Text>
              <div>{pkg.availableSeats}/{pkg.totalSeats}</div>
            </Col>
            <Col span={12}>
              <Typography.Text type="secondary">Duration:</Typography.Text>
              <div>{pkg.duration}</div>
            </Col>
            <Col span={24}>
              <Typography.Text type="secondary">Dates:</Typography.Text>
              <div>
                {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
              </div>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="site-card-wrapper">
      <Card className="shadow-md">
        <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12}>
            <Title level={4} style={{ margin: 0 }}>Manage Packages</Title>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setShowForm(true);
                setSelectedPackage(null);
              }}
            >
              Add Package
            </Button>
          </Col>
          <Col xs={24}>
            <Radio.Group 
              value={filter} 
              onChange={handleFilterChange}
              optionType="button" 
              buttonStyle="solid"
            >
              <Radio.Button value="all">All Packages</Radio.Button>
              <Radio.Button value="active">Active</Radio.Button>
              <Radio.Button value="inactive">Inactive</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        <Spin spinning={loading}>
          {isMobile ? (
            <MobileCardView data={getFilteredData()} />
          ) : (
            <Table
              columns={columns}
              dataSource={getFilteredData()}
              rowKey="_id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                pageSizeOptions: ['6', '10', '20'],
                showTotal: (total) => `Total ${total} packages`,
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          )}
        </Spin>
      </Card>

      {showForm && (
        <PackageForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchPackages({ page: pagination.current });
            setShowForm(false);
          }}
          selectedPackage={selectedPackage}
        />
      )}
    </div>
  );
};

export default PackageManager;