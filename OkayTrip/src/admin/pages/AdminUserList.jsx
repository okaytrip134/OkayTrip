import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Card, Popconfirm, message } from "antd";
import { fetchAllUsers, deleteUser } from "../../api/admin";

const { Title } = Typography;

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      message.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err.message || err);
      message.error(err.message || "Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      render: (phone) => phone || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card>
        <Title level={3} className="mb-4">
          Manage Users
        </Title>
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey={(record) => record._id}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminUserList;
