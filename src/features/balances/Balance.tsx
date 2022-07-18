import React, { useState } from "react";
import { Card, Modal, Spin, Avatar, message, Typography } from "antd";
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
const { Text } = Typography;

const Balance = ({ balanceId }: { balanceId: EntityId }) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const [syncing, setSyncing] = useState(false);

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

  return (
    <Card
      title={
        <a
          href={`${network.explorer}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text copyable={!balance.tag} style={{ width: "60%" }} ellipsis>
            {balance.tag || address}
          </Text>
        </a>
      }
      extra={
        <a
          href={
            token === AddressZero
              ? `${network.explorer}/address/${address}`
              : `${network.explorer}/token/${token}?a=${address}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          More
        </a>
      }
      bordered={false}
      actions={[
        <>
          {syncing ? (
            <LoadingOutlined />
          ) : (
            <SyncOutlined
              key="sync"
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
            />
          )}
        </>,
        <DeleteOutlined
          key="delete"
          style={{ color: "red" }}
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
        />,
      ]}
    >
      <Spin spinning={syncing}>
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
      </Spin>
    </Card>
  );
};

export default Balance;
