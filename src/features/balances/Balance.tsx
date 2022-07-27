import { useAuth0 } from "@auth0/auth0-react";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { EntityId } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { ErrorMessage } from "../../common/types";
import CopyableRow from "../CopyableRow";
import { selectNetworkByName } from "../networks/networksSlice";
import {
  deleteWallets,
  fetchBalance,
  selectBalanceById,
} from "./balancesSlice";

const Balance = ({ balanceId }: { balanceId: EntityId }) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const [syncing, setSyncing] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const balance = useAppSelector((state) =>
    selectBalanceById(state, balanceId)
  );

  const network = useAppSelector((state) =>
    selectNetworkByName(state, balance?.network || "")
  );

  if (!balance || !network) {
    return null;
  }

  const address = getAddress(balance.address);
  const token = getAddress(balance.token);

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          sx={{
            "& .MuiCardHeader-content": {
              overflow: "hidden",
            },
          }}
          avatar={
            <Avatar
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
            balance.balance >= 0 ? (
              <Tooltip
                title={`${balance.balance.toLocaleString("en-US", {
                  maximumSignificantDigits: 18,
                })} ${balance.symbol} @ ${balance.network}`}
              >
                <Typography variant="subtitle2" noWrap>
                  {`${balance.balance.toLocaleString("en-US", {
                    maximumSignificantDigits: 18,
                  })} ${balance.symbol}`}
                </Typography>
              </Tooltip>
            ) : (
              <Typography variant="subtitle2" noWrap>
                Cannot get balance
              </Typography>
            )
          }
          subheader={balance.network}
          subheaderTypographyProps={{ noWrap: true }}
          action={
            <Tooltip title="Refresh balance">
              <IconButton
                disabled={syncing}
                onClick={async () => {
                  try {
                    setSyncing(true);
                    const token = await getAccessTokenSilently();
                    await dispatch(
                      fetchBalance({ token, id: balance.id })
                    ).unwrap();
                    enqueueSnackbar("Balance updated", {
                      variant: "success",
                    });
                  } catch (error) {
                    enqueueSnackbar((error as ErrorMessage).message, {
                      variant: "error",
                    });
                  } finally {
                    setSyncing(false);
                  }
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
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <CopyableRow label="Address" value={address} />
            </Grid>
            <Grid item xs={12}>
              <CopyableRow
                label="Token"
                value={token === AddressZero ? balance.symbol : token}
              />
            </Grid>
          </Grid>
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
              try {
                setDeleting(true);
                const token = await getAccessTokenSilently();
                await dispatch(
                  deleteWallets({ token, id: balance.id })
                ).unwrap();
                enqueueSnackbar("Query deleted", { variant: "success" });
                setOpen(false);
              } catch (error) {
                enqueueSnackbar((error as ErrorMessage).message, {
                  variant: "error",
                });
              } finally {
                setDeleting(false);
              }
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
