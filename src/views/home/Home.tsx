import React from "react";
import { Layout, Typography, Space } from "antd";
import Networks from "../../features/networks/Networks";
const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  return (
    <Content
      style={{
        marginTop: "64px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space direction="vertical" size="middle" style={{ maxWidth: "900px" }}>
        <Title level={3}>Supported Networks</Title>
        <Networks />
      </Space>
    </Content>
  );
};

export default Home;
