import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, message } from "antd";
import icon from '../../assets/icons/ic-reset-password.svg'
import { Subtitles } from "lucide-react";
import '../../styles/Adminlogin.css'

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/admin/auth/login`, {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("adminToken", response.data.token);
      message.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      message.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <div
        style={{
          padding: "40px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px", display:'flex', flexDirection:'column', alignItems:'center' }}>
        <img
            src={icon}
            alt="Custom Icon"
            style={{ width: "60px", height: "60px", marginBottom: "10px", alignItems:"center", display:'flex' }}
          />
          <Title level={2}>Welcome Back Admin</Title>
          <h3>Please enter your details below to sign in.</h3>
        </div>
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="custom-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
