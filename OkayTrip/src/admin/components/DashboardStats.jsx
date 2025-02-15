'use client';

import { Col, Row, Typography, Card } from "antd";
import ReactApexChart from "react-apexcharts";
import glass_bag from "../../assets/glass/ic_glass_bag.png";
import glass_buy from "../../assets/glass/ic_glass_buy.png";
import glass_message from "../../assets/glass/ic_glass_message.png";
import glass_users from "../../assets/glass/ic_glass_users.png";
import AnalysisCard from "../components/AnalysisCard";

export default function Datacard() {
  const pieOptions = {
    chart: {
      type: 'pie',
    },
    labels: ["America", "Asia", "Europe", "Africa"],
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const pieSeries = [28.4, 35.5, 8.4, 27.7];

  const lineOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ["2003-01-01", "2003-02-01", "2003-03-01", "2003-04-01", "2003-05-01", "2003-06-01"],
      labels: {
        format: "MMM yyyy"
      }
    },
    tooltip: {
      x: {
        format: "MMM yyyy"
      }
    },
    colors: ["#008FFB", "#00E396", "#FEB019"],
    legend: {
      position: 'top'
    }
  };

  const lineSeries = [
    {
      name: "Team A",
      data: [23, 27, 35, 40, 45, 50]
    },
    {
      name: "Team B",
      data: [44, 67, 55, 40, 35, 20]
    },
    {
      name: "Team C",
      data: [30, 50, 45, 60, 70, 80]
    }
  ];

  return (
    <div className="p-4">
      <Typography.Title level={2}>Hi, Welcome back Admin 👋</Typography.Title>
      <Row gutter={[16, 16]} justify="center">
        <Col lg={6} md={12} span={24}>
          <AnalysisCard
            cover={glass_bag}
            title="1000"
            subtitle="Total Booking"
            style={{
              color: "#008059",
              background: "linear-gradient(135deg, rgba(204, 234, 225, 0.8), rgba(204, 234, 225, 0.8))",
            }}
          />
        </Col>
        <Col lg={6} md={12} span={24}>
          <AnalysisCard
            cover={glass_users}
            title="500"
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
            title="200"
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
            title="70"
            subtitle="Total Categories"
            style={{
              color: "#DB4026",
              background: "linear-gradient(135deg, rgba(249, 217, 211, 0.8), rgba(249, 217, 211, 0.8))",
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-8">
        <Col lg={12} span={24}>
          <Card title="Website Visits" bordered={false}>
            <ReactApexChart options={lineOptions} series={lineSeries} type="line" height={300} />
          </Card>
        </Col>
        <Col lg={12} span={24}>
          <Card title="Current Visits" bordered={false}>
            <ReactApexChart options={pieOptions} series={pieSeries} type="pie" height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
