import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  message,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../service/blogServices";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;
const { Text, Paragraph } = Typography;

// Custom React Quill modules and formats
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "font",
  "align",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();
  const [editingBlog, setEditingBlog] = useState(null);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogsAdmin();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error(
        error.response?.data?.message || 
        "Failed to fetch blogs. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = (blog = null) => {
    setEditingBlog(blog);
    setModalVisible(true);
    setFile(null);
    setImagePreview(blog?.image || null);

    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        slug: blog.slug, // ✅ Add this line
        tags: blog.tags.join(", "),
        status: blog.status,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        metaKeywords: blog.metaKeywords,
      });
      // Use setTimeout to ensure Quill is ready before setting content
      setTimeout(() => {
        setContent(blog.content || "");
      }, 100);
    } else {
      form.resetFields();
      setTimeout(() => {
        setContent("");
      }, 100);
    }
  };

  const handleFileChange = ({ file }) => {
    if (file) {
      setFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    if (!content || content.trim() === "") {
      return message.error("Content is required.");
    }
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", content);
    formData.append("slug", values.slug || "");
    formData.append("tags", values.tags);
    formData.append("status", values.status);
    formData.append("metaTitle", values.metaTitle);
    formData.append("metaDescription", values.metaDescription);
    formData.append("metaKeywords", values.metaKeywords);

    if (file) {
      formData.append("image", file);
    } else if (editingBlog?.image && !imagePreview) {
      // If no new file is uploaded and preview is cleared
      formData.append("removeImage", "true");
    }

    try {
      setLoading(true);
      
      // Debug: Log formData before sending
      console.log("Submitting form data:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      if (editingBlog) {
        const response = await updateBlog(editingBlog._id, formData);
        message.success("Blog updated successfully!");
      } else {
        const response = await createBlog(formData);
        message.success("Blog created successfully!");
      }
      
      setModalVisible(false);
      fetchBlogs();
    } catch (error) {
      console.error("Full error:", error);
      message.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to save blog. Please check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog?",
      content: "This action cannot be undone",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteBlog(id, token);
          message.success("Blog deleted successfully!");
          fetchBlogs();
        } catch (error) {
          console.error("Error deleting blog:", error);
          message.error("Failed to delete blog");
        }
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Time ago utility
  const timeAgo = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return `${interval} year${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval === 1 ? "" : "s"} ago`;

    return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image) => (
        <img
          src={`${import.meta.env.VITE_APP_API_URL}${image}`}
          alt="Blog"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug) => <Text copyable>{slug}</Text>,
      ellipsis: true,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => tags.join(", "),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text
          style={{
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: status === "Published" ? "#e6f7ff" : "#fff7e6",
            color: status === "Published" ? "#1890ff" : "#fa8c16",
          }}
        >
          {status}
        </Text>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={formatDate(date)}>
          <Text
            type="secondary"
            style={{
              color: "black",
            }}
          >
            {timeAgo(date)}
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      width: 150,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => (
        <Tooltip title={formatDate(date)}>
          <Text
            type="secondary"
            style={{
              color: "black",
            }}
          >
            {timeAgo(date)}
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, blog) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentBlog(blog);
              setViewModalVisible(true);
            }}
          />
          <Button icon={<EditOutlined />} onClick={() => openModal(blog)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(blog._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Blog Management
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          size="large"
          style={{
            marginBottom: "10px",
          }}
        >
          New Blog
        </Button>
      </div>

      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
        size="middle"
        className="black-bordered-table"
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingBlog ? "Edit Blog" : "Create Blog"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter blog title" }]}
              >
                <Input placeholder="Blog title" size="large" />
              </Form.Item>
            </Col>

            <Text
              type="warning"
              style={{ display: "block", marginBottom: "8px" }}
            >
              Note: Image should not exceed 1MB and recommended size is
              1024x1024 pixels.
            </Text>

            <Col span={24}>
              <Form.Item label="Content" required>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => {
                    setContent(value);
                  }}
                  modules={modules}
                  formats={formats}
                  style={{ height: "300px", marginBottom: "40px" }}
                  key={editingBlog?._id || "new"} // Add key to force remount
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="tags"
                label="Tags"
                tooltip="Separate tags with commas"
              >
                <Input placeholder="e.g., travel, adventure, wildlife" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Draft">
                <Select>
                  <Option value="Draft">Draft</Option>
                  <Option value="Published">Published</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Featured Image">
                <Upload
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  maxCount={1}
                  accept="image/*"
                  listType="picture-card"
                  showUploadList={false}
                >
                  {imagePreview ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          imagePreview.startsWith("data:")
                            ? imagePreview
                            : `${import.meta.env.VITE_APP_API_URL}${imagePreview}`
                        }
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <Button
                        type="link"
                        danger
                        style={{ position: "absolute", top: 0, right: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined style={{ fontSize: "24px" }} />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="metaTitle"
                label="Meta Title"
                rules={[{ required: true, message: "Meta title is required" }]}
              >
                <Input placeholder="SEO Meta Title" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="slug"
                label="Slug"
                tooltip="Unique URL identifier. Auto-generated if left empty."
                rules={[
                  {
                    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message:
                      "Only lowercase letters, numbers, and dashes allowed.",
                  },
                ]}
              >
                <Input placeholder="e.g., wildlife-photography-tips" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="metaDescription"
                label="Meta Description"
                rules={[
                  { required: true, message: "Meta description is required" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Write a concise meta description (max 160 characters)"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="metaKeywords"
                label="Meta Keywords"
                tooltip="Separate keywords with commas"
              >
                <Input placeholder="e.g., travel, adventure, wildlife" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Blog Modal */}
      <Modal
        title={currentBlog?.title}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              openModal(currentBlog);
            }}
          >
            Edit
          </Button>,
        ]}
        width={800}
      >
        {currentBlog && (
          <div className="blog-content">
            {currentBlog.image && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={`${import.meta.env.VITE_APP_API_URL}${currentBlog.image}`}
                  alt={currentBlog.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text type="secondary">Tags: {currentBlog.tags.join(", ")}</Text>
              <Text
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor:
                    currentBlog.status === "Published" ? "#e6f7ff" : "#fff7e6",
                  color:
                    currentBlog.status === "Published" ? "#1890ff" : "#fa8c16",
                }}
              >
                {currentBlog.status}
              </Text>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Text strong>Slug:</Text> <Text copyable>{currentBlog.slug}</Text>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Text strong>Meta Keywords:</Text> {currentBlog.metaKeywords}
            </div>

            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              style={{
                padding: 0,
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: 1.6,
              }}
            />
          </div>
        )}
      </Modal>
      {/* <style jsx>
        {`
          .black-bordered-table table {
            border: 1px solid #000 !important;
          }
          .black-bordered-table th,
          .black-bordered-table td {
            border: 1px solid #000 !important;
          }
          .black-bordered-descriptions table {
            border: 1px solid #000 !important;
          }
          .black-bordered-descriptions th,
          .black-bordered-descriptions td {
            border: 1px solid #000 !important;
          }
          .black-bordered-descriptions th {
            background-color: var(--bg-color) !important;
            color: #fff !important;
          }
          .black-bordered-table th {
            background-color: var(--bg-color) !important;
            color: #fff !important;
          }

          .black-bordered-table
            .ant-table-column-sort
            .ant-table-column-sorter-up.active,
          .black-bordered-table
            .ant-table-column-sort
            .ant-table-column-sorter-down.active {
            color: #ff4d4f;
          }
        `}
      </style> */}
    </div>
  );
};

export default AdminBlogs;
