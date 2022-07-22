import { MetaMaskInpageProvider } from "@metamask/providers";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import type { EntityId } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import React from "react";

import { useAppSelector } from "../../common/hooks";
import CopyableRow from "../CopyableRow";
import { selectNetworkByName } from "./networksSlice";

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

  const { enqueueSnackbar } = useSnackbar();

  if (!network) {
    return null;
  }

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
    <Card variant="outlined">
      <CardHeader
        avatar={<Avatar src={`/assets/${network.name}.svg`} />}
        title={network.name}
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
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
        }
      />
      <CardContent>
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <CopyableRow label="RPC URL" value={network.url} />
          </Grid>
          <Grid item xs={12}>
            <CopyableRow
              label="Chain ID"
              value={parseInt(network.chainId, 16).toString()}
            />
          </Grid>
          <Grid item xs={12}>
            <CopyableRow label="Currency Symbol" value={network.symbol} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Tooltip title={`Switch to ${network.name}`}>
          <IconButton onClick={handleSwitch}>
            <SwapHorizIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default Network;
