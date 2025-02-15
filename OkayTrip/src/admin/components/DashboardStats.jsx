'use client';

import { Col, Row, Typography } from "antd";
import glass_bag from "../../assets/glass/ic_glass_bag.png";
import glass_buy from "../../assets/glass/ic_glass_buy.png";
import glass_message from "../../assets/glass/ic_glass_message.png";
import glass_users from "../../assets/glass/ic_glass_users.png";
import AnalysisCard from "../components/AnalysisCard";
function Datacard() {
  return (
    <div className="p-4">
      {" "}
      {/* Increased padding around the whole dashboard */}
      <Typography.Title level={2}>Hi, Welcome back Admin 👋</Typography.Title>
      <Row gutter={[16, 16]} justify="center">
        <Col lg={6} md={12} span={24}>
          <AnalysisCard
            cover={glass_bag}
            title="1000"
            subtitle="Total Booking"
            style={{
              color: "#008059", // Dark green for text
              background: `linear-gradient(135deg, rgba(204, 234, 225, 0.8), rgba(204, 234, 225, 0.8))`, // #CCEAE1 in gradient
            }}
          />
        </Col>
        <Col lg={6} md={12} span={24}>
          <AnalysisCard
            cover={glass_users}
            title="500"
            subtitle="Total users"
            style={{
              color: "#0092B3", // Dark blue for text
              background: `linear-gradient(135deg, rgba(204, 237, 244, 0.8), rgba(204, 237, 244, 0.8))`, // #CCEDF4 in gradient
            }}
          />
        </Col>
        <Col lg={6} md={12} span={24}>
          <AnalysisCard
            cover={glass_buy}
            title="200"
            subtitle="Total Tours"
            style={{
              color: "#D95834", // Orange for text
              background: `linear-gradient(135deg, rgba(252, 226, 217, 0.8), rgba(252, 226, 217, 0.8))`, // #FCE2D9 in gradient
            }}
          />
        </Col>
        <Col lg={6} md={12} span={24}>
          <AnalysisCard
            cover={glass_message}
            title="70"
            subtitle="Total categories"
            style={{
              color: "#DB4026", // Red for text
              background: `linear-gradient(135deg, rgba(249, 217, 211, 0.8), rgba(249, 217, 211, 0.8))`, // #F9D9D3 in gradient
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Datacard;
