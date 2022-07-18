import React, { useState } from "react";
import { Space, message } from "antd";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Link,
} from "@mui/material";
import { ContentCopy, Done, SwapHoriz, OpenInNew } from "@mui/icons-material";
import copy from "clipboard-copy";
// import { PlusCircleOutlined, SwapOutlined } from "@ant-design/icons";
import type { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../common/hooks";
import { selectNetworkByName } from "./networksSlice";
import { MetaMaskInpageProvider } from "@metamask/providers";
// const { Title, Text } = Typography;

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

  const [copied, setCopied] = useState(false);

  if (!network) {
    return null;
  }

  const handleCopy = () => {
    setCopied(true);
    copy(network.url).then(() => {
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { ethereum } = window;

  const handleSwitch = async () => {
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

  // const handleSet = async () => {
  //   if (ethereum) {
  //     try {
  //       await ethereum.request({
  //         method: "wallet_switchEthereumChain",
  //         params: [{ chainId: network.chainId }],
  //       });
  //     } catch (e) {
  //       message.error((e as ProviderRpcError).message);
  //     }
  //   } else {
  //     message.error("MetaMask is not installed");
  //   }
  // };

  return (
    // <Card
    //   title={
    //     <Space size="middle">
    //       <Avatar src={`/assets/${network.name}.svg`} />
    //       <Title level={5}>{network.name}</Title>
    //     </Space>
    //   }
    //   bordered={false}
    //   actions={[
    //     <Tooltip key="add" title={`Add ${network.name} to MetaMask`}>
    //       <PlusCircleOutlined onClick={handleAdd} />
    //     </Tooltip>,
    //     <Tooltip key="switch" title={`Switch to ${network.name}`}>
    //       <SwapOutlined onClick={handleSet} />
    //     </Tooltip>,
    //   ]}
    // >
    //   <Text ellipsis copyable type="secondary" style={{ width: "100%" }}>
    //     {network.url}
    //   </Text>
    // </Card>
    <Card>
      <CardHeader
        avatar={<Avatar src={`/assets/${network.name}.svg`} />}
        title={<Typography variant="subtitle1">{network.name}</Typography>}
      />
      {/* <Divider /> */}
      <CardContent>
        <Button
          variant="text"
          endIcon={
            copied ? <Done color="primary" /> : <ContentCopy color="action" />
          }
          onClick={handleCopy}
          color="inherit"
          disableElevation
          style={{
            maxWidth: "100%",
            textTransform: "none",
            // display: "flex",
            // justifyContent: "flex-start",
          }}
        >
          <Typography variant="body2" color="text.secondary" noWrap>
            {network.url}
          </Typography>
        </Button>
      </CardContent>
      <CardActions>
        <Tooltip title={`Switch to ${network.name}`}>
          <IconButton onClick={handleSwitch}>
            <SwapHoriz />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Open block explorer in a new tab`}>
          <IconButton
            component={Link}
            href={network.explorer}
            target="_blank"
            rel="noreferrer"
          >
            <OpenInNew />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default Network;
