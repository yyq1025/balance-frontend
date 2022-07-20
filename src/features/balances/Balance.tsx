import React, { useState } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Link,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useSnackbar } from "notistack";
import copy from "clipboard-copy";
import { getAddress } from "@ethersproject/address";
import type { EntityId } from "@reduxjs/toolkit";
import { AddressZero } from "@ethersproject/constants";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalanceById,
  fetchBalance,
  deleteWallets,
} from "./balancesSlice";
import { selectNetworkByName } from "../networks/networksSlice";

const Balance = ({ balanceId }: { balanceId: EntityId }) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const balance = useAppSelector((state) =>
    selectBalanceById(state, balanceId)
  );
  if (!balance) {
    return null;
  }

  const network = useAppSelector((state) =>
    selectNetworkByName(state, balance.network)
  );
  if (!network) {
    return null;
  }

  const address = getAddress(balance.address);
  const token = getAddress(balance.token);

  const handleCopy = () => {
    setCopied(true);
    copy(address).then(() => {
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <Card>
        <CardHeader
          sx={{
            "& .MuiCardHeader-content": {
              overflow: "hidden",
            },
          }}
          avatar={
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={
                token === AddressZero
                  ? `https://assets-cdn.trustwallet.com/blockchains/${balance.network
                      .replace("-", "")
                      .toLowerCase()}/info/logo.png`
                  : `https://assets-cdn.trustwallet.com/blockchains/${balance.network
                      .replace("-", "")
                      .toLowerCase()}/assets/${token}/logo.png`
              }
            >
              <QuestionMarkIcon />
            </Avatar>
          }
          title={
            balance.balance ? (
              <Tooltip
                title={`${balance.balance} ${balance.symbol} @ ${balance.network}`}
              >
                <Typography variant="body2" noWrap>
                  {`${balance.balance} ${balance.symbol}`}
                </Typography>
              </Tooltip>
            ) : (
              "Cannot get balance"
            )
          }
          subheader={balance.network}
          subheaderTypographyProps={{ noWrap: true }}
          action={
            <Tooltip title="Refresh balance">
              <IconButton
                disabled={syncing}
                onClick={async () => {
                  setSyncing(true);
                  try {
                    await dispatch(
                      fetchBalance({ getAccessTokenSilently, id: balance.id })
                    ).unwrap();
                    enqueueSnackbar("Balance updated", {
                      variant: "success",
                    });
                  } catch (error) {
                    enqueueSnackbar(error as string, { variant: "error" });
                  }
                  setSyncing(false);
                }}
              >
                {syncing ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  <RefreshIcon />
                )}
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          <Tooltip title={copied ? "Copied" : "Copy address"}>
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
              <Typography variant="body2" noWrap>
                {address}
              </Typography>
            </Button>
          </Tooltip>
        </CardContent>
        <CardActions>
          <Tooltip title="View on block explorer">
            <Link
              color="inherit"
              href={
                token === AddressZero
                  ? `${network.explorer}/address/${address}`
                  : `${network.explorer}/token/${token}?a=${address}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <IconButton>
                <OpenInNewIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Delete this query" sx={{ ml: "auto" }}>
            <IconButton color="error" onClick={() => setOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure delete this query?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will not be able to fetch balance of this query again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={deleting} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={deleting}
            color="error"
            onClick={async () => {
              setDeleting(true);
              try {
                await dispatch(
                  deleteWallets({ getAccessTokenSilently, id: balance.id })
                ).unwrap();
                enqueueSnackbar("Query deleted", { variant: "success" });
              } catch (error) {
                enqueueSnackbar(error as string, { variant: "error" });
              }
              setDeleting(false);
              setOpen(false);
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Balance;
