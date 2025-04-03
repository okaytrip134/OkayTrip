import React, { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  InputNumber, 
  message, 
  Upload, 
  Card, 
  Divider, 
  Spin, 
  Row, 
  Col,
  Typography
} from "antd";
import { 
  UploadOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  DollarOutlined, 
  PlusOutlined, 
  ArrowLeftOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CreateOffer = () => {
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState({
    title: null,
    totalCoupons: 0,
    price: 0,
    endDate: "",
    bannerImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleFileChange = (info) => {
    if (info.file) {
      // Get the file object
      const file = info.file.originFileObj || info.file;
      setOfferData({ ...offerData, bannerImage: file });
      
      // Create preview URL
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("bannerImage", offerData.bannerImage);
      formData.append("totalCoupons", values.totalCoupons);
      formData.append("price", values.price);
      formData.append("endDate", values.endDate);

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/create-offer`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.offer) {
        message.success({
          content: "Offer created successfully!",
          duration: 3,
          style: { marginTop: '20px' }
        });
        // navigate("/admin/view-offers");
      } else {
        throw new Error(data.message || "Failed to create offer");
      }
    } catch (error) {
      message.error({
        content: `Error: ${error.message || "Failed to create offer"}`,
        duration: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <Card 
        className="max-w-4xl mx-auto shadow-md rounded-lg"
        bordered={false}
      >
        <div className="flex items-center mb-6">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="mr-4"
          />
          <Title level={2} className="mb-0">Create New Offer</Title>
        </div>
        
        <Divider />
        
        <Spin spinning={loading} tip="Creating offer...">
          <Form 
            form={form}
            onFinish={handleSubmit} 
            layout="vertical"
            requiredMark="optional"
            className="mt-6"
          >
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                <Form.Item
                  label={<span className="text-base font-medium">Offer Title</span>}
                  name="title"
                  rules={[{ required: true, message: "Please enter the offer title" }]}
                >
                  <Input 
                    size="large" 
                    placeholder="Enter a descriptive title for this offer" 
                    prefix={<TagOutlined className="text-gray-400" />}
                  />
                </Form.Item>
                
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-base font-medium">Total Coupons</span>}
                      name="totalCoupons"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber 
                        min={1} 
                        size="large" 
                        style={{ width: '100%' }} 
                        placeholder="Number of available coupons"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-base font-medium">Price</span>}
                      name="price"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber 
                        min={0} 
                        size="large" 
                        style={{ width: '100%' }} 
                        placeholder="Offer price"
                        prefix={<DollarOutlined className="text-gray-400" />}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  label={<span className="text-base font-medium">End Date</span>}
                  name="endDate"
                  rules={[{ required: true, message: "Please select the offer end date" }]}
                >
                  <DatePicker 
                    showTime 
                    size="large" 
                    style={{ width: '100%' }} 
                    format="YYYY-MM-DD HH:mm:ss" 
                    placeholder="Select end date and time"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} lg={8}>
                <Form.Item
                  label={<span className="text-base font-medium">Offer Banner Image</span>}
                  name="bannerImage"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[{ required: true, message: "Please upload a banner image" }]}
                >
                  <Upload.Dragger
                    name="bannerImage"
                    accept="image/*"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                  >
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div className="py-6">
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined style={{ fontSize: '32px' }} />
                        </p>
                        <p className="ant-upload-text">Click or drag an image</p>
                        <p className="ant-upload-hint text-xs text-gray-500">
                          Recommended size: 1200 x 600px
                        </p>
                      </div>
                    )}
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
            
            <Divider />
            
            <div className="flex justify-end">
              {/* <Button 
                onClick={() => navigate('/admin/view-offers')}
                style={{ marginRight: 16 }}
              >
                Cancel
              </Button> */}
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<PlusOutlined />} 
                size="large"
              >
                Create Offer
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default CreateOffer;