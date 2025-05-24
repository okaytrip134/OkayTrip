import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Checkbox, Card, Table, message, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, FireOutlined } from "@ant-design/icons";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [svgFile, setSvgFile] = useState(null);
  const [isTrending, setIsTrending] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/?isAdmin=true`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setCategories(data);
    } catch (error) {
      message.error("Failed to fetch categories.");
    }
  };

  const handleCreateCategory = async () => {
    if (!svgFile) {
      message.error("Please upload an SVG file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("svgFile", svgFile);
    formData.append("isTrending", isTrending);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${adminToken}` } }
      );
      message.success(data.message);
      setName("");
      setSvgFile(null);
      setIsTrending(false);
      fetchCategories();
    } catch (error) {
      message.error("Failed to create category.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Category status updated.");
      fetchCategories();
    } catch (error) {
      message.error("Failed to update category status.");
    }
  };

  const handleToggleTrending = async (id, currentTrending) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/${id}/trending`,
        { isTrending: !currentTrending },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Trending status updated.");
      fetchCategories();
    } catch (error) {
      message.error("Failed to update trending status.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/categories/${id}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Category deleted.");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      key: "isActive",
      render: (record) =>
        record.isActive ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Active
          </Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Inactive
          </Tag>
        ),
    },
    {
      title: "Trending",
      key: "isTrending",
      render: (record) =>
        record.isTrending ? (
          <Tag color="orange" icon={<FireOutlined />}>
            Trending
          </Tag>
        ) : (
          <Tag color="gray">Not Trending</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            type="default"
            onClick={() => handleToggleStatus(record._id, record.isActive)}
            style={{
              backgroundColor: record.isActive ? "#f37002" : "#52c41a",
              color: "#fff",
            }}
          >
            {record.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            type="default"
            onClick={() => handleToggleTrending(record._id, record.isTrending)}
            style={{
              backgroundColor: record.isTrending ? "#fa8c16" : "#d9d9d9",
              color: "#fff",
            }}
          >
            {record.isTrending ? "Remove Trending" : "Make Trending"}
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCategory(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      <div className="mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Category Management</h1> */}

        {/* Category Form */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              size="large"
            />
            <Input
              type="file"
              accept=".svg"
              onChange={(e) => setSvgFile(e.target.files[0])}
              size="large"
            />
            <div className="flex items-center">
              <Checkbox
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              >
                Trending
              </Checkbox>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="mt-4"
            onClick={handleCreateCategory}
            style={{ backgroundColor: "#f37002", borderColor: "#f37002" }}
          >
            Add Category
          </Button>
        </Card>

        {/* Existing Categories Table */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Existing Categories</h2>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </Card>
      </div>
    </div>
  );
};

export default CategoryManager;
