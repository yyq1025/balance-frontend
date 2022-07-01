import React, { useState, useEffect } from "react";
import { Space, Card, Button, Typography, Row, Col, message } from "antd";
import { PlusOutlined, SyncOutlined, DeleteOutlined } from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../../hooks";
import QueryCreateForm from "./QueryCreateForm";
import { BASE_URL } from "../Constants";

interface Balance {
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: number | string;
  tag?: string;
}

type BalancesProps = {
  user: any;
};

const Balances = ({ user }: BalancesProps) => {
  const [visible, setVisible] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);

  const fetchBalances = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/wallet/balance`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        timeout: 5000,
      });
      console.log(res);
      setBalances(res.data.wallets || []);
    } catch (error) {
      const err = error as AxiosError<any>;
      console.log(err);
      if (err.response?.data) {
        message.error(err.response.data.message);
      } else {
        message.error(err.message);
      }
    }
  };

  const onCreate = async (values: any) => {
    console.log("Received values of form: ", values);
    try {
      const res = await axios.post(`${BASE_URL}/wallet`, values, {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 5000,
      });
      console.log(res);
      message.success(res.data.message);
      fetchBalances();
    } catch (error) {
      const err = error as AxiosError<any>;
      console.log(err);
      if (err.response?.data) {
        message.error(err.response.data.message);
      } else {
        message.error(err.message);
      }
    }
    setVisible(false);
  };

  useEffect(() => {
    fetchBalances();
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
                <SyncOutlined key="sync" />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <Card.Meta
                title={
                  typeof balance.balance === "string"
                    ? balance.balance
                    : balance.balance + " " + balance.symbol
                }
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
