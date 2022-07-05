import React, { useState } from "react";
import { Card, Modal, Typography, Spin, Avatar, Image } from "antd";
import {
  SyncOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { getAddress } from "@ethersproject/address";
import type { EntityId } from "@reduxjs/toolkit";
import { AddressZero } from "@ethersproject/constants";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectBalanceById,
  fetchBalance,
  deleteWallets,
} from "../../slices/balancesSlice";
import { selectNetworkByName } from "../../slices/networksSlice";
const { Title, Text } = Typography;

const Balance = ({ balanceId }: { balanceId: EntityId }) => {
  const dispatch = useAppDispatch();

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

  const [loading, setLoading] = useState(false);
  return (
    <Card
      title={
        <a
          href={`${network.explorer}/address/${balance.address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Title level={5} underline copyable={!balance.tag} ellipsis={true}>
            {balance.tag || balance.address}
          </Title>
        </a>
      }
      bordered={false}
      actions={[
        <SyncOutlined
          key="sync"
          spin={loading}
          onClick={async () => {
            if (!loading) {
              setLoading(true);
              await dispatch(fetchBalance(balance.id));
              setLoading(false);
            }
          }}
        />,
        <a
          key="more"
          href={
            balance.token === AddressZero
              ? `${network.explorer}/address/${balance.address}`
              : `${network.explorer}/token/${balance.token}?a=${balance.address}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <EllipsisOutlined style={{ fontSize: "16px" }} />
        </a>,
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
                return dispatch(deleteWallets(balance.id));
              },
            });
          }}
        />,
      ]}
    >
      <Spin spinning={loading}>
        <Card.Meta
          avatar={
            <Avatar
              src={
                balance.token === AddressZero
                  ? `https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/info/logo.png`
                  : `https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/assets/${getAddress(
                      balance.token
                    )}/logo.png`
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
