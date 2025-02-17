import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Upload, Button, Card, Typography, message, Spin, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AdminBannerManager = () => {
  const [form] = Form.useForm();
  const [bannerData, setBannerData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fetch current banner data
  const fetchBanner = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/banner`
      );
      if (data.banner) {
        setBannerData(data.banner);
        form.setFieldsValue(data.banner);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      message.error("Failed to fetch banner data");
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // Handle form submission
  const handleUpdateBanner = async (values) => {
    if (!values.title || !values.subtitle) {
      message.error("Title and Subtitle are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("subtitle", values.subtitle);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Banner updated successfully!");
      setBannerData(data.banner);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating banner:", error);
      message.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      setImageFile(file);
      return false;
    },
    maxCount: 1,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-3xl mx-auto shadow-md">
        <Title level={2} className="text-center mb-6">
          Banner Management
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateBanner}
          initialValues={bannerData}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the banner title!" }]}
          >
            <Input placeholder="Enter banner title" size="large" />
          </Form.Item>

          <Form.Item
            label="Subtitle"
            name="subtitle"
            rules={[{ required: true, message: "Please input the banner subtitle!" }]}
          >
            <Input.TextArea
              placeholder="Enter banner subtitle"
              size="large"
              rows={3}
            />
          </Form.Item>

          <Form.Item label="Banner Image">
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {bannerData.imageUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Current Banner:</p>
                <Image
                  src={`${import.meta.env.VITE_APP_API_URL}${bannerData.imageUrl}`}
                  alt="Current Banner"
                  className="rounded-lg"
                  height={200}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600"
              size="large"
            >
              Update Banner
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminBannerManager;