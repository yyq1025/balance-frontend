import React, { useState } from "react";
import { Card, Modal, Spin, Avatar } from "antd";
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
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalanceById,
  fetchBalance,
  deleteWallets,
} from "./balancesSlice";
import { selectAuthData } from "../../common/authSlice";
import { selectNetworkByName } from "../networks/networksSlice";
import EllipsisMiddle from "../../common/EllipsisMiddle";

const Balance = ({ balanceId }: { balanceId: EntityId }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthData);
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
          <EllipsisMiddle copyable={!balance.tag} suffixCount={4}>
            {balance.tag || address}
          </EllipsisMiddle>
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
                await dispatch(
                  fetchBalance({ token: user?.token, id: balance.id })
                );
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
              onOk() {
                return dispatch(
                  deleteWallets({ token: user?.token, id: balance.id })
                );
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
                balance.token === AddressZero
                  ? `https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/info/logo.png`
                  : `https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/assets/${token}/logo.png`
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
