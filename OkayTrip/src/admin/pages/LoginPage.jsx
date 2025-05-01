/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button, Form, Input, Typography, message, Checkbox, Row, Col, Layout,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import dashboardpng from '../../assets/svg/login-security.svg';
import overlayImg from '../../assets/overlay.jpg';
import logo from '../../assets/favicon.ico';
import { useAuth } from "../context/authContext";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  // generate captcha when component mounts
  useEffect(() => {
    generateCaptcha();
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(captcha);
  };

  const handleLogin = async (values) => {
    if (userCaptcha !== captchaText) {
      message.error("Invalid CAPTCHA");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/admin/auth/login`, {
        email: values.username,
        password: values.password,
      });

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
        className="hidden grow flex-col items-center justify-center gap-[80px] bg-center  bg-no-repeat md:flex"
      >
                <img  className="absolute top-0 left-0 max-w-[70px] m-8" src={logo} alt="logo" />
        <img className="max-w-[800px]" src={dashboardpng} alt="dashboard" />
      </div>

      <div className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px] " style={{ backgroundColor: "#ffff" }}>
        <div className="mb-10 pb-10  text-2xl font-semibold xl:text-3xl">Welcome Back Admin</div>

        <Form name="login" size="large" onFinish={handleLogin}>
          <Form.Item name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
            <Input.Password
              placeholder="••••••••"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-between mb-2">
              <div className="relative bg-[#dddddd] px-6 py-2 border rounded shadow-sm">
                <div className="flex gap-2">
                  {captchaText.split("").map((char, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: "cursive",
                        fontWeight: "bold",
                        fontSize: `${18 + Math.floor(Math.random() * 6)}px`,
                        transform: `rotate(${Math.floor(Math.random() * 30 - 15)}deg)`,
                        display: "inline-block",
                        color: ["#000", "#444", "#666", "#111"][i % 4],
                        textShadow: "1px 1px #ccc",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                {/* Optional Noise Line */}
                <svg width="100%" height="20" className="absolute left-0 top-0 opacity-20">
                  <line
                    x1="0"
                    y1="15"
                    x2="100%"
                    y2="5"
                    stroke="#888"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                </svg>
              </div>

              <button
                type="button"
                className="ml-3 text-lg text-green-500 underline"
                onClick={generateCaptcha}
              >
                Refresh
              </button>
            </div>

            <Input
              placeholder="Enter CAPTCHA"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value.toUpperCase())}
              className="tracking-widest"
            />
          </Form.Item>


          <Form.Item>
            <Row align="middle">
              <Col span={12}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-lg">Remember me</Checkbox>
                </Form.Item>
              </Col>
              <Col span={12} className="text-right">
                <Button type="link" className="!underline text-green-500 " size="large">
                  Forget Password?
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button  htmlType="submit" className="w-full bg-green-500 text-lg text-center hover:border-amber-300 " loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default LoginPage;
