import React from "react";
import { Layout, Typography, Row, Col, Card, Avatar, Space } from "antd";
import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectNetworks } from "../../slices/networksSlice";
import { fetchNetworks } from "../../actions/networks";
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector(selectNetworks);

  React.useEffect(() => {
    dispatch(fetchNetworks());
  }, []);

  const handleClick = (network: any) => {
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
