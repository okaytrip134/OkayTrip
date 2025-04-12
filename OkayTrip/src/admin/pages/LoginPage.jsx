import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Typography, message, Checkbox, Row, Col, Divider, Layout } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from "react-icons/ai";
import '../../styles/Adminlogin.css';
import dashboardpng from '../../assets/dashboard.png';
import overlayImg from '../../assets/overlay.jpg'; // You'll need to add this image
import logo from '../../assets/Logo/Trip ok new 2 black-01.png'
import { useAuth } from "../context/authContext";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/admin/auth/login`, {
        email: values.username,
        password: values.password,
      });
      // localStorage.setItem("adminToken", response.data.token);
      login(response.data.token);
      message.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      message.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="relative flex !min-h-screen !w-full !flex-row">
      <div
        className="hidden grow flex-col items-center justify-center gap-[80px] bg-center bg-no-repeat md:flex"
        style={{
          background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)) center center / cover no-repeat, url(${overlayImg})`,
        }}
      >
        <div className="text-3xl font-bold leading-normal lg:text-4xl xl:text-5xl">
          <img src={logo} alt="okay trip" className="h-24 w-80" />
        </div>
        <img className="max-w-[480px] xl:max-w-[560px]" src={dashboardpng} alt="Dashboard illustration" />
        {/* <Typography.Text className="flex flex-row gap-[16px] text-2xl">
          Backstage management system
        </Typography.Text> */}
      </div>

      <div className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px]">
        <div className="mb-4 text-2xl font-bold xl:text-3xl">Admin Panel
        </div>

        <Form
          name="login"
          size="large"
          initialValues={{
            remember: true
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              type="password"
              placeholder="••••••••"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Row align="middle">
              <Col span={12}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Col>
              <Col span={12} className="text-right">
                <Button type="link" className="!underline" size="small">
                  Forget Password?
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
            Admin Login
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="absolute right-2 top-0 flex flex-row">
        {/* Language selector and settings button would go here */}
      </div>
    </Layout>
  );
};

export default LoginPage;