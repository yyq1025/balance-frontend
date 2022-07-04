import React, { useState } from "react";
import { Card, Modal, Typography, Spin, Avatar, Image } from "antd";
import {
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { getAddress } from "@ethersproject/address";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchBalance, deleteWallet } from "../../actions/balances";
import type { Balance } from "../../slices/balancesSlice";

type BalanceProps = {
  balance: Balance;
};

const BalanceCard = ({ balance }: BalanceProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);
  return (
    console.log(
      `https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/assets/${getAddress(
        balance.token
      )}/logo.png`
    ),
    (
      <Card
        title={
          <a
            href={`https://etherscan.io/address/${balance.address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography.Title
              level={5}
              underline
              copyable={!balance.tag}
              ellipsis={true}
            >
              {balance.tag || balance.address}
            </Typography.Title>
          </a>
        }
        bordered={false}
        actions={[
          <>
            {loading ? (
              <LoadingOutlined key="loading" />
            ) : (
              <SyncOutlined
                key="sync"
                onClick={async () => {
                  setLoading(true);
                  await dispatch(fetchBalance(balance.id));
                  setLoading(false);
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
                  return dispatch(deleteWallet(balance.id));
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
                src={`https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/assets/${getAddress(
                  balance.token
                )}/logo.png`}
                icon={
                  <Image
                    src={`https://assets-cdn.trustwallet.com/blockchains/${balance.network.toLowerCase()}/info/logo.png`}
                    fallback="https://etherscan.io/images/main/empty-token.png"
                  />
                }
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
    )
  );
};

export default BalanceCard;
