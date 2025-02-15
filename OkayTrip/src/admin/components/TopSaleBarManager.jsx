import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Checkbox, Button, Card, List, Empty, Row, Col, notification, Typography } from "antd";
import axios from "axios";
import moment from "moment";

const { Title, Text } = Typography;

const TopSaleBarManager = () => {
  const [saleBars, setSaleBars] = useState([]);
  const [form] = Form.useForm();

  const fetchSaleBars = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/top-sale-bar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaleBars(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrUpdate = async (values) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/top-sale-bar/add-or-update`,
        {
          ...values,
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notification.success({ message: "Sale bar added/updated successfully!" });
      form.resetFields();
      fetchSaleBars();
    } catch (error) {
      console.error(error);
      notification.error({ message: "Failed to add/update sale bar." });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/admin/top-sale-bar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({ message: "Sale bar deleted successfully!" });
      fetchSaleBars();
    } catch (error) {
      console.error(error);
      notification.error({ message: "Failed to delete sale bar." });
    }
  };

  useEffect(() => {
    fetchSaleBars();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Row justify="center" className="mb-6">
        <Col span={24}>
          <Title level={3} className="text-center text-primary mb-1">
            Manage Top Sale Bar
          </Title>
          <Text type="secondary" className="text-center block mb-3">
            Add, update, or manage your top sale bar notifications.
          </Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Add or Update Sale Bar" bordered={false} className="shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddOrUpdate}
              initialValues={{ active: false }}
            >
              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: "Please enter the message" }]}
              >
                <Input placeholder="Enter message" />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: "Please select the start date" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: "Please select the end date" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="active" valuePropName="checked">
                <Checkbox>Set as Active</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  block
                  size="large"
                  className="hover:bg-[#f37002] hover:text-white text-[#f37002] border-[#f37002]"
                >
                  Add/Update Sale Bar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Existing Sale Bars" bordered={false} className="shadow-sm">
            {saleBars.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={saleBars}
                renderItem={(bar) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => handleDelete(bar._id)}
                      className="bg-[#f37002] border border-[#f37002]"
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>{bar.message}</Text>}
                      description={
                        <Text type="secondary">
                          {moment(bar.startDate).format("YYYY-MM-DD")} - {moment(bar.endDate).format("YYYY-MM-DD")}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No Sale Bars Found" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TopSaleBarManager;
