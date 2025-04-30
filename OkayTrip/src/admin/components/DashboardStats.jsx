'use client';

import { Col, Row, Typography, Spin } from "antd";
import glass_bag from "../../assets/glass/ic_glass_bag.png";
import glass_buy from "../../assets/glass/ic_glass_buy.png";
import glass_message from "../../assets/glass/ic_glass_message.png";
import glass_users from "../../assets/glass/ic_glass_users.png";
import AnalysisCard from "../components/AnalysisCard";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Datacard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalPackages: 0,
    totalCategories: 0,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        
        // Fetch all data from existing endpoints
        const [bookingsRes, usersRes, packagesRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/bookings`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }),
          axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }),
          axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/packages`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }),
          axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/categories/?isAdmin=true`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          })
        ]);

        setStats({
          totalBookings: bookingsRes.data.bookings?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          totalPackages: packagesRes.data.packages?.length || 0,
          totalCategories: categoriesRes.data?.length || 0,
          loading: false
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        setStats(prev => ({...prev, loading: false}));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <Typography.Title level={2}>Hi, Welcome back Admin 👋</Typography.Title>
      
      <Spin spinning={stats.loading}>
        <Row gutter={[16, 16]} justify="center">
          <Col lg={6} md={12} span={24}>
            <AnalysisCard
              cover={glass_bag}
              title={stats.totalBookings.toLocaleString()}
              subtitle="Total Bookings"
              style={{
                color: "#008059",
                background: "linear-gradient(135deg, rgba(204, 234, 225, 0.8), rgba(204, 234, 225, 0.8))",
              }}
            />
          </Col>
          <Col lg={6} md={12} span={24}>
            <AnalysisCard
              cover={glass_users}
              title={stats.totalUsers.toLocaleString()}
              subtitle="Total Users"
              style={{
                color: "#0092B3",
                background: "linear-gradient(135deg, rgba(204, 237, 244, 0.8), rgba(204, 237, 244, 0.8))",
              }}
            />
          </Col>
          <Col lg={6} md={12} span={24}>
            <AnalysisCard
              cover={glass_buy}
              title={stats.totalPackages.toLocaleString()}
              subtitle="Total Tours"
              style={{
                color: "#D95834",
                background: "linear-gradient(135deg, rgba(252, 226, 217, 0.8), rgba(252, 226, 217, 0.8))",
              }}
            />
          </Col>
          <Col lg={6} md={12} span={24}>
            <AnalysisCard
              cover={glass_message}
              title={stats.totalCategories.toLocaleString()}
              subtitle="Total Categories"
              style={{
                color: "#DB4026",
                background: "linear-gradient(135deg, rgba(249, 217, 211, 0.8), rgba(249, 217, 211, 0.8))",
              }}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}