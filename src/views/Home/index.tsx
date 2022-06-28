import React from "react";
import { Layout, Typography, Row, Col, Card, Avatar, Space } from "antd";
import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import { BASE_URL } from "../../constants";
import "./index.css";
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface Network {
  name: string;
  url: string;
  symbol: string;
}

const HomePage = () => {
  const [networks, setNetworks] = React.useState<Array<Network>>([]);

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
    <Layout>
      <Header>
        <Navbar />
      </Header>
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
                  actions={[
                    <PlusCircleOutlined
                      key="add"
                      onClick={() => handleClick(network)}
                    />,
                    <SwapOutlined key="set" />,
                  ]}
                  className="network-card"
                >
                  <Text copyable type="secondary">
                    {network.url}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </Content>
      <Footer style={{ textAlign: "center" }}>Copyright © WitEx.io 2022</Footer>
    </Layout>
  );
};

export default HomePage;
