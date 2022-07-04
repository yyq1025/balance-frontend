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
import { selectNetworks, Network } from "../../slices/networksSlice";
import { fetchNetworks } from "../../actions/networks";
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector(selectNetworks);

  React.useEffect(() => {
    if (!networks.loaded) {
      dispatch(fetchNetworks());
    }
  }, []);

  const handleAdd = async (network: Network) => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: network.chainId,
              chainName: network.name,
              rpcUrls: [network.url],
            },
          ],
        });
      } catch (e) {
        message.error((e as any)?.message);
      }
    }
    console.log(network);
  };

  const handleSet = async (network: Network) => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: network.chainId }],
        });
      } catch (e) {
        message.error((e as any)?.message);
      }
    }
  };

  return (
    <Content>
      <Space direction="vertical" size="middle" className="home-page-content">
        <Title level={3}>Supported Networks</Title>
        <Row gutter={[16, 16]}>
          {networks.networks.map((network) => (
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
                    onClick={() => handleAdd(network)}
                  />,
                  <SwapOutlined key="set" onClick={() => handleSet(network)} />,
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
