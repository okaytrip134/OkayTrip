import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Card,
  Typography,
  Divider,
  Badge,
  DatePicker,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const AdminContactEnquiries = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateRange, setFilterDateRange] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contacts, filterName, filterEmail, filterPhone, filterStatus, filterDateRange]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/contact-form/`);
      if (response.data && Array.isArray(response.data.contacts)) {
        setContacts(response.data.contacts);
        setFilteredContacts(response.data.contacts);
      } else {
        console.error("Unexpected API response:", response.data);
        setContacts([]);
        setFilteredContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (contact) => {
    setSelectedContact(contact);
    setStatus(contact.status || "Pending");
    setRemark(contact.remark || "");
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/contact-form/update/${selectedContact._id}`, {
        status,
        remark,
      });
      message.success("Contact updated successfully!");
      fetchContacts();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating contact:", error);
      message.error("Failed to update contact");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/contact-form/delete/${id}`);
      message.success("Contact deleted successfully!");
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      message.error("Failed to delete contact");
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Pending":
        return <Tag color="red"><ExclamationCircleOutlined /> Pending</Tag>;
      case "Resolved":
        return <Tag color="green"><CheckCircleOutlined /> Resolved</Tag>;
      case "Not Intrested":
        return <Tag color="orange"><CloseCircleOutlined /> Not Intrested</Tag>;
      case "No Response":
        return <Tag color="gray"><CloseCircleOutlined /> No Response</Tag>;
      default:
        return <Tag color="blue">{status}</Tag>;
    }
  };

  // Apply filters to the data
  const applyFilters = () => {
    let results = [...contacts];
    
    if (filterName) {
      results = results.filter(item => 
        item.name?.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    
    if (filterEmail) {
      results = results.filter(item => 
        item.email?.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    
    if (filterPhone) {
      results = results.filter(item => 
        item.phone?.includes(filterPhone)
      );
    }
    
    if (filterStatus) {
      results = results.filter(item => item.status === filterStatus);
    }
    
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      const startDate = filterDateRange[0].startOf('day');
      const endDate = filterDateRange[1].endOf('day');
      
      results = results.filter(item => {
        const itemDate = moment(item.createdAt);
        return itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate);
      });
    }
    
    setFilteredContacts(results);
  };

  // Reset all filters
  const clearFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setFilterPhone("");
    setFilterStatus("");
    setFilterDateRange(null);
  };

  // Download CSV function
  const downloadCSV = () => {
    // Define columns to include in CSV
    const csvColumns = [
      "Date & Time", "Name", "Email", "Phone", "Message", "Status", "Remark"
    ];
    
    // Format data for CSV
    const csvData = filteredContacts.map(item => ({
      "Date & Time": moment(item.createdAt).format("DD-MM-YYYY hh:mm A"),
      "Name": item.name || "N/A",
      "Email": item.email || "N/A",
      "Phone": item.phone || "N/A",
      "Message": item.message || "N/A",
      "Status": item.status || "Pending",
      "Remark": item.remark || "N/A"
    }));
    
    // Convert to CSV format
    const header = csvColumns.join(',');
    const rows = csvData.map(row => 
      csvColumns.map(col => {
        let value = row[col] || '';
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    const csv = [header, ...rows].join('\n');
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `contact_enquiries_${moment().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success("CSV file has been downloaded");
  };

  // Table Columns
  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY hh:mm A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width:'180px',
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width:'100px'
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure you want to delete this contact?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={4}>Admin Contact Enquiries</Title>}
      extra={
        <Space>
          <Tooltip title="Toggle Filter Panel">
            <Button 
              type={isFilterVisible ? "primary" : "default"}
              icon={<FilterOutlined />} 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              Filter
            </Button>
          </Tooltip>
          <Tooltip title="Download as CSV">
            <Button 
              icon={<DownloadOutlined />} 
              onClick={downloadCSV}
              disabled={filteredContacts.length === 0}
            >
              Export CSV
            </Button>
          </Tooltip>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchContacts} 
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      }
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
    >
      {/* Filter Panel */}
      {isFilterVisible && (
        <Card 
          size="small" 
          style={{ marginBottom: 16, background: "#f9f9f9" }}
          title="Filter Options"
          extra={
            <Button 
              icon={<ClearOutlined />} 
              onClick={clearFilters}
              size="small"
            >
              Clear Filters
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item label="Name" style={{ marginBottom: 0 }}>
                <Input 
                  placeholder="Filter by name" 
                  value={filterName} 
                  onChange={e => setFilterName(e.target.value)}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item label="Email" style={{ marginBottom: 0 }}>
                <Input 
                  placeholder="Filter by email" 
                  value={filterEmail} 
                  onChange={e => setFilterEmail(e.target.value)}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item label="Phone" style={{ marginBottom: 0 }}>
                <Input 
                  placeholder="Filter by phone" 
                  value={filterPhone} 
                  onChange={e => setFilterPhone(e.target.value)}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item label="Status" style={{ marginBottom: 0 }}>
                <Select 
                  placeholder="Filter by status" 
                  value={filterStatus} 
                  onChange={value => setFilterStatus(value)}
                  allowClear
                  style={{ width: '100%' }}
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="Resolved">Resolved</Option>
                  <Option value="Not Intrested">Not Intrested</Option>
                  <Option value="No Response">No Response</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item label="Date Range" style={{ marginBottom: 0 }}>
                <RangePicker 
                  value={filterDateRange}
                  onChange={dates => setFilterDateRange(dates)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )}

      {/* Results Info */}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          {filteredContacts.length === contacts.length 
            ? `Showing all ${filteredContacts.length} contacts` 
            : `Found ${filteredContacts.length} matching contacts out of ${contacts.length} total`
          }
        </Text>
      </div>

      {/* Contact Table */}
      <Table
        columns={columns}
        dataSource={filteredContacts}
        rowKey="_id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} contacts`
        }}
        bordered
        size="middle"
        rowClassName={(record, index) => index % 2 === 0 ? "table-row-light" : "table-row-dark"}
        className="black-bordered-table"
      />

      {/* Contact Details Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            <span>Contact Details</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Popconfirm
            key="delete"
            title="Are you sure you want to delete this contact?"
            onConfirm={() => handleDelete(selectedContact?._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete Contact
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleUpdate}
          >
            Save Changes
          </Button>,
        ]}
        width={600}
      >
        {selectedContact && (
          <>
            <div className="contact-info-section">
              <p><strong>Name:</strong> {selectedContact.name}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Phone:</strong> {selectedContact.phone}</p>
              <p><strong>Date:</strong> {moment(selectedContact.createdAt).format("DD-MM-YYYY hh:mm A")}</p>
              <p><strong>Message:</strong> {selectedContact.message}</p>

              <Divider />

              <p>
                <strong>Current Status:</strong>{" "}
                {getStatusTag(selectedContact.status || "Pending")}
              </p>
              <p>
                <strong>Current Remark:</strong>{" "}
                {selectedContact.remark || "No remark added"}
              </p>
            </div>

            <Divider />

            <Form layout="vertical">
              <Form.Item label="Update Status" required>
                <Select value={status} onChange={setStatus} className="w-full">
                  <Option value="Pending">
                    <Badge status="error" text="Pending" />
                  </Option>
                  <Option value="Resolved">
                    <Badge status="success" text="Resolved" />
                  </Option>
                  <Option value="Not Intrested">
                    <Badge status="warning" text="Not Intrested" />
                  </Option>
                  <Option value="No Response">
                    <Badge status="default" text="No Response" />
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label="Remark">
                <TextArea 
                  rows={4} 
                  value={remark} 
                  onChange={(e) => setRemark(e.target.value)} 
                  placeholder="Enter remark or notes"
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

    </Card>
  );
};

export default AdminContactEnquiries;