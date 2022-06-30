import React, { useState, useEffect } from "react";
import { Space, Card, Button, Typography, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../hooks";
import QueryCreateForm from "./QueryCreateForm";
import { BASE_URL } from "../Constants";

interface Balance {
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: number;
  tag?: string;
}

type BalancesProps = {
  user: any;
};

const Balances = ({ user }: BalancesProps) => {
  const [visible, setVisible] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);

  const onCreate = (values: any) => {
    console.log("Received values of form: ", JSON.stringify(values));
    fetch(`${BASE_URL}/wallet`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setVisible(false);
  };

  useEffect(() => {
    fetch(`${BASE_URL}/wallet/balance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setBalances(res.wallets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Card>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        >
          Add Query
        </Button>
        <QueryCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => setVisible(false)}
        />
      </Card>
      <Row gutter={[16, 16]}>
        {balances.map((balance, index) => (
          <Col span={6} key={index}>
            <Card
              title={
                <Typography.Title
                  level={5}
                  copyable={!balance.tag}
                  ellipsis={{ tooltip: true }}
                >
                  {balance.tag || balance.address}
                </Typography.Title>
              }
              actions={[
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <Card.Meta
                title={balance.balance + " " + balance.symbol}
                description={balance.network}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default Balances;
