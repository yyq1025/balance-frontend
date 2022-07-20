import React, { useState } from "react";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useSnackbar } from "notistack";
import copy from "clipboard-copy";
import type { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../common/hooks";
import { selectNetworkByName } from "./networksSlice";
import { MetaMaskInpageProvider } from "@metamask/providers";

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

  const { enqueueSnackbar } = useSnackbar();

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
          method: "wallet_switchEthereumChain",
          params: [{ chainId: network.chainId }],
        });
      } catch (e) {
        const err = e as ProviderRpcError;
        if (err.code === 4902) {
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
            enqueueSnackbar((e as ProviderRpcError).message, {
              variant: "error",
            });
          }
        } else {
          enqueueSnackbar(err.message, { variant: "error" });
        }
      }
    } else {
      enqueueSnackbar("MetaMask is not installed", { variant: "error" });
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={`/assets/${network.name}.svg`}
            sx={{ width: 32, height: 32 }}
          />
        }
        title={<Typography variant="subtitle1">{network.name}</Typography>}
      />
      <CardContent>
        <Tooltip title={copied ? "Copied" : "Copy RPC URL"}>
          <Button
            variant="text"
            endIcon={
              copied ? (
                <DoneIcon color="primary" />
              ) : (
                <ContentCopyIcon color="action" />
              )
            }
            onClick={handleCopy}
            color="inherit"
            disableElevation
            style={{
              maxWidth: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary" noWrap>
              {network.url}
            </Typography>
          </Button>
        </Tooltip>
      </CardContent>
      <CardActions>
        <Tooltip title={`Switch to ${network.name}`}>
          <IconButton onClick={handleSwitch}>
            <SwapHorizIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open block explorer">
          <Link
            href={network.explorer}
            target="_blank"
            rel="noreferrer"
            color="inherit"
          >
            <IconButton>
              <OpenInNewIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default Network;
