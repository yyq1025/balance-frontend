import React from "react";
import { Layout, Typography, Row, Col, Card, Avatar, Space } from "antd";
import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Constants";
import "./index.css";
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Network {
  name: string;
  url: string;
  symbol: string;
}

const Home = () => {
  const [networks, setNetworks] = React.useState<Network[]>([]);

  React.useEffect(() => {
    fetch(BASE_URL + "/network", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setNetworks(data.networks);
      });
  }, []);

  const handleClick = (network: Network) => {
    console.log(network);
  };

  return (
    <Content>
      <Space direction="vertical" size="middle" className="home-page-content">
        <Title level={3}>Supported Networks</Title>
        <Row gutter={[16, 16]}>
          {networks.map((network) => (
            <Col key={network.name} span={8}>
              <Card
                title={
                  <Space size="middle">
                    <Avatar src={`/assets/${network.name}.svg`} />
                    <Title level={5}>{network.name}</Title>
                  </Space>
                }
                bordered={false}
                actions={[
                  <PlusCircleOutlined
                    key="add"
                    onClick={() => handleClick(network)}
                  />,
                  <SwapOutlined key="set" />,
                ]}
              >
                <Text
                  ellipsis
                  copyable
                  type="secondary"
                  style={{ width: "100%" }}
                >
                  {network.url}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Content>
  );
};

export default Home;
