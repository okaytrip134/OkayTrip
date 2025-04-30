import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, Input, Button, Space, Select, Form, 
  Typography, Card, notification, Tag, Modal, Spin,
  Tooltip, Popconfirm, Dropdown, Menu
} from "antd";
import { 
  SearchOutlined, SaveOutlined, EyeOutlined, 
  ReloadOutlined, FilterOutlined, ExportOutlined,
  DownOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Status tags color mapping
  const statusColors = {
    Pending: "orange",
    Contacted: "blue",
    Closed: "green"
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads whenever search text or status filter changes
  useEffect(() => {
    let filtered = [...leads];
    
    if (searchText) {
      filtered = filtered.filter(lead => 
        lead.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.packageTitle?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.phone?.includes(searchText)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    
    setFilteredLeads(filtered);
  }, [searchText, statusFilter, leads]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/leads/all`);
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      notification.error({
        message: "Failed to fetch leads",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (record) => {
    try {
      await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/admin/leads/update/${record._id}`, {
        status: record.status,
        remarks: record.remarks
      });
      
      notification.success({
        message: "Lead Updated",
        description: "Lead information has been updated successfully."
      });
      
      setEditingId(null);
      fetchLeads(); // Refresh leads
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description: error.message
      });
    }
  };

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      // Prepare data for export
      const data = filteredLeads.map(lead => ({
        Name: lead.fullName,
        Email: lead.email,
        Phone: lead.phone,
        Package: lead.packageTitle,
        'Travel Date': dayjs(lead.travelDate).format("DD MMM YYYY"),
        Travelers: lead.travellerCount,
        Message: lead.message,
        Status: lead.status,
        Remarks: lead.remarks
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      
      // Generate file and download
      XLSX.writeFile(workbook, "Leads_Export.xlsx");
      
      notification.success({
        message: "Export Successful",
        description: "Leads data has been exported to Excel."
      });
    } catch (error) {
      notification.error({
        message: "Export Failed",
        description: error.message
      });
    } finally {
      setExportLoading(false);
    }
  };

  const statusMenu = (
    <Menu onClick={({ key }) => setStatusFilter(key === "all" ? null : key)}>
      <Menu.Item key="all">All Statuses</Menu.Item>
      <Menu.Item key="Pending">Pending</Menu.Item>
      <Menu.Item key="Contacted">Contacted</Menu.Item>
      <Menu.Item key="Closed">Closed</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => <a href={`mailto:${text}`}>{text}</a>
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a href={`tel:${text}`}>{text}</a>
    },
    {
      title: "Package",
      dataIndex: "packageTitle",
      key: "packageTitle",
      sorter: (a, b) => a.packageTitle?.localeCompare(b.packageTitle),
    },
    {
      title: "Travel Date",
      dataIndex: "travelDate",
      key: "travelDate",
      width: 120,
      sorter: (a, b) => new Date(a.travelDate) - new Date(b.travelDate),
      render: (date) => (
        <Tooltip title={dayjs(date).format("DD MMM YYYY")}>
          <div className="truncate">{dayjs(date).format("DD MMM YYYY")}</div>
        </Tooltip>
      )
    },
    {
      title: "Travelers",
      dataIndex: "travellerCount",
      key: "travellerCount",
      sorter: (a, b) => a.travellerCount - b.travellerCount,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => (
        <Tooltip title={text || "No message"}>
          <div className="max-w-[150px] truncate">{text || "No message"}</div>
        </Tooltip>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Contacted", value: "Contacted" },
        { text: "Closed", value: "Closed" }
      ],
      onFilter: (value, record) => record.status === value,
      render: (text, record) => {
        const isEditing = record._id === editingId;
        
        return isEditing ? (
          <Select 
            defaultValue={text} 
            style={{ width: 120 }}
            onChange={(value) => {
              const updatedLeads = [...leads];
              const index = updatedLeads.findIndex(lead => lead._id === record._id);
              updatedLeads[index] = { ...updatedLeads[index], status: value };
              setLeads(updatedLeads);
            }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Contacted">Contacted</Option>
            <Option value="Closed">Closed</Option>
          </Select>
        ) : (
          <Tag color={statusColors[text] || "default"}>{text}</Tag>
        );
      }
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text, record) => {
        const isEditing = record._id === editingId;
        
        return isEditing ? (
          <TextArea
            defaultValue={text}
            style={{ width: 200 }}
            autoSize={{ minRows: 2, maxRows: 4 }}
            onChange={(e) => {
              const updatedLeads = [...leads];
              const index = updatedLeads.findIndex(lead => lead._id === record._id);
              updatedLeads[index] = { ...updatedLeads[index], remarks: e.target.value };
              setLeads(updatedLeads);
            }}
          />
        ) : (
          <div className="max-w-[200px] truncate">{text || "No remarks"}</div>
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => {
        const isEditing = record._id === editingId;
        
        return isEditing ? (
          <Space>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={() => handleSave(record)}
            >
              Save
            </Button>
            <Button onClick={() => setEditingId(null)}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => setEditingId(record._id)}
            >
              Edit
            </Button>
          </Space>
        );
      }
    }
  ];

  return (
    <Card className="mx-auto max-w-[1600px]">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="flex justify-between items-center">
          <Title level={3}>Admin Panel - Leads Management</Title>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchLeads}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <div className="flex justify-between flex-wrap gap-4">
          <Search
            placeholder="Search by name, email, phone or package..."
            allowClear
            enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
            size="large"
            onSearch={value => setSearchText(value)}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
          
          <Space>
            <Button 
              icon={<ExportOutlined />} 
              onClick={exportToExcel}
              loading={exportLoading}
            >
              Export to Excel
            </Button>
            
            <Dropdown overlay={statusMenu} trigger={['click']}>
              <Button icon={<FilterOutlined />}>
                Filter by Status <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </div>

        {statusFilter && (
          <div className="mb-2">
            <Tag closable onClose={() => setStatusFilter(null)}>
              Status: {statusFilter}
            </Tag>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredLeads}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} leads`
          }}
          size="middle"
          bordered
        />
      </Space>
    </Card>
  );
};

export default LeadsPage;