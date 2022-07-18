import React from "react";
import { Card, Avatar, Space, message, Typography, Tooltip } from "antd";
import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import type { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../common/hooks";
import { selectNetworkByName } from "./networksSlice";
import { MetaMaskInpageProvider } from "@metamask/providers";
const { Title, Text } = Typography;

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

const Network = ({ networkName }: { networkName: EntityId }) => {
  const network = useAppSelector((state) =>
    selectNetworkByName(state, networkName)
  );

  if (!network) {
    return null;
  }

  const { ethereum } = window;

  const handleAdd = async () => {
    if (ethereum) {
      try {
        await ethereum.request({
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
        message.error((e as ProviderRpcError).message);
      }
    } else {
      message.error("MetaMask is not installed");
    }
  };

  const handleSet = async () => {
    if (ethereum) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: network.chainId }],
        });
      } catch (e) {
        message.error((e as ProviderRpcError).message);
      }
    } else {
      message.error("MetaMask is not installed");
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
        <Tooltip key="add" title={`Add ${network.name} to MetaMask`}>
          <PlusCircleOutlined onClick={handleAdd} />
        </Tooltip>,
        <Tooltip key="switch" title={`Switch to ${network.name}`}>
          <SwapOutlined onClick={handleSet} />
        </Tooltip>,
      ]}
    >
      <Text ellipsis copyable type="secondary" style={{ width: "100%" }}>
        {network.url}
      </Text>
    </Card>
  );
};

export default Network;
