import React from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Avatar,
  Space,
  message,
} from "antd";
import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectNetworkNames,
  selectNetworksLoaded,
  fetchNetworks,
} from "../../slices/networksSlice";
import Network from "./Network";
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const dispatch = useAppDispatch();
  const networkNames = useAppSelector(selectNetworkNames);
  const loaded = useAppSelector(selectNetworksLoaded);

  React.useEffect(() => {
    if (!loaded) {
      dispatch(fetchNetworks());
    }
  }, []);

  return (
    <Content>
      <Space direction="vertical" size="middle" className="home-page-content">
        <Title level={3}>Supported Networks</Title>
        <Row gutter={[16, 16]}>
          {networkNames.map((networkName) => (
            <Col span={8} key={networkName}>
              <Network key={networkName} networkName={networkName} />
            </Col>
          ))}
        </Row>
      </Space>
    </Content>
  );
};

export default Home;
