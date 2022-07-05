import React from "react";
import { Card, Avatar, Space, message, Col, Typography } from "antd";
import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import type { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import { selectNetworkByName } from "../../slices/networksSlice";
const { Title, Text } = Typography;

const Network = ({ networkName }: { networkName: EntityId }) => {
  const network = useAppSelector((state) =>
    selectNetworkByName(state, networkName)
  );

  if (!network) {
    return null;
  }

  const handleAdd = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: network.chainId,
              chainName: network.name,
              nativeCurrency: {
                symbol: network.symbol,
                decimals: 18,
              },
              rpcUrls: [network.url],
              blockExplorerUrls: [network.explorer],
            },
          ],
        });
      } catch (e) {
        message.error((e as any)?.message);
      }
    }
  };

  const handleSet = async () => {
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
    <Card
      title={
        <Space size="middle">
          <Avatar src={`/assets/${network.name}.svg`} />
          <Title level={5}>{network.name}</Title>
        </Space>
      }
      bordered={false}
      actions={[
        <PlusCircleOutlined key="add" onClick={handleAdd} />,
        <SwapOutlined key="set" onClick={handleSet} />,
      ]}
    >
      <Text ellipsis copyable type="secondary" style={{ width: "100%" }}>
        {network.url}
      </Text>
    </Card>
  );
};

export default Network;
