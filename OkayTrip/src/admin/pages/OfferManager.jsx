import React, { useState, useEffect } from "react";
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
  Typography,
  Table,
  Tag,
  Space,
  Popconfirm
} from "antd";
import { 
  UploadOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  DollarOutlined, 
  PlusOutlined, 
  ArrowLeftOutlined,
  FireOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OffersManagement = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
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

  useEffect(() => {
    if (activeTab === 'view') {
      fetchOffers();
    }
  }, [activeTab]);

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
        bannerImage: offer.bannerImage || '/uploads/default-offer.jpg'
      }));
      setOffers(formattedOffers);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    if (info.file) {
      const file = info.file.originFileObj || info.file;
      setOfferData({ ...offerData, bannerImage: file });
      
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
        setActiveTab('view');
        form.resetFields();
        setPreviewImage(null);
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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
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

  return (
    <div className="bg-gray-50 min-h-screen p-0">
      <Card 
        className="max-w-8xl mx-auto shadow-md rounded-lg"
        bordered={false}
        tabList={[
          { key: 'view', tab: 'View Offers' },
          { key: 'create', tab: 'Create Offer' },
        ]}
        activeTabKey={activeTab}
        onTabChange={key => setActiveTab(key)}
      >
        {activeTab === 'view' ? (
          <div>
            <div className="flex items-center mb-6">
              <Title level={2} className="mb-0">Manage Offers</Title>
            </div>
            
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
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => setActiveTab('view')}
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
          </div>
        )}
      </Card>
    </div>
  );
};

export default OffersManagement;