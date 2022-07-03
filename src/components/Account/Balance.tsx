import React, { useState } from "react";
import { Card, Modal, Typography, Spin } from "antd";
import {
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export interface Balance {
  id: number;
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: string;
  tag?: string;
}

type BalanceProps = {
  balance: Balance;
  onSync: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const BalanceCard = ({ balance, onSync, onDelete }: BalanceProps) => {
  const [loading, setLoading] = useState(false);
  return (
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
              style={{ color: "#1890ff" }}
              onClick={async () => {
                setLoading(true);
                await onSync(balance.id);
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
                return onDelete(balance.id);
              },
            });
          }}
        />,
      ]}
    >
      <Spin spinning={loading}>
        <Card.Meta
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

export default BalanceCard;
