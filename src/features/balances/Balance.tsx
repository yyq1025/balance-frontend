import React, { useState } from "react";
import { Modal, Spin, message } from "antd";
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
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import copy from "clipboard-copy";
import {
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
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
// const { Text } = Typography;

const Balance = ({ balanceId }: { balanceId: EntityId }) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <Card
    // title={
    //   <a
    //     href={`${network.explorer}/address/${address}`}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     <Text copyable={!balance.tag} style={{ width: "60%" }} ellipsis>
    //       {balance.tag || address}
    //     </Text>
    //   </a>
    // }
    // extra={
    //   <a
    //     href={
    //       token === AddressZero
    //         ? `${network.explorer}/address/${address}`
    //         : `${network.explorer}/token/${token}?a=${address}`
    //     }
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     More
    //   </a>
    // }
    // bordered={false}
    // actions={[
    //   <>
    //     {syncing ? (
    //       <LoadingOutlined />
    //     ) : (
    //       <SyncOutlined
    //         key="sync"
    //         onClick={async () => {
    //           setSyncing(true);
    //           try {
    //             await dispatch(
    //               fetchBalance({ getAccessTokenSilently, id: balance.id })
    //             ).unwrap();
    //             message.success("Query updated");
    //           } catch (error) {
    //             message.error(error as string);
    //           }
    //           setSyncing(false);
    //         }}
    //       />
    //     )}
    //   </>,
    //   <DeleteOutlined
    //     key="delete"
    //     style={{ color: "red" }}
    //     onClick={() => {
    //       Modal.confirm({
    //         title: "Are you sure delete this query?",
    //         icon: <ExclamationCircleOutlined />,
    //         content: "This will permanently delete this query.",
    //         okText: "Yes",
    //         okType: "danger",
    //         cancelText: "No",
    //         async onOk() {
    //           try {
    //             await dispatch(
    //               deleteWallets({ getAccessTokenSilently, id: balance.id })
    //             ).unwrap();
    //             message.success("Query deleted");
    //           } catch (error) {
    //             message.error(error as string);
    //           }
    //         },
    //       });
    //     }}
    //   />,
    // ]}
    >
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
          balance.balance
            ? balance.balance + " " + balance.symbol
            : "Cannot get balance"
        }
        titleTypographyProps={{
          noWrap: true,
        }}
        subheader={balance.network}
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
                  message.success("Query updated");
                } catch (error) {
                  message.error(error as string);
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
              textTransform: "none",
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
          <IconButton
            onClick={() => {
              Modal.confirm({
                title: "Are you sure delete this query?",
                icon: <ExclamationCircleOutlined />,
                content: "This will permanently delete this query.",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                async onOk() {
                  try {
                    await dispatch(
                      deleteWallets({ getAccessTokenSilently, id: balance.id })
                    ).unwrap();
                    message.success("Query deleted");
                  } catch (error) {
                    message.error(error as string);
                  }
                },
              });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
      {/* <Spin spinning={syncing}>
        <Card.Meta
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
              icon={<QuestionOutlined />}
            />
          }
          title={
            balance.balance
              ? balance.balance + " " + balance.symbol
              : "Cannot get balance"
          }
          description={balance.network}
        />
      </Spin> */}
    </Card>
  );
};

export default Balance;
