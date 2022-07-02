import React, { useState, useEffect } from "react";
import {
  Space,
  Card,
  Button,
  Typography,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import {
  PlusOutlined,
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../../hooks";
import QueryCreateForm from "./QueryCreateForm";
import { BASE_URL } from "../Constants";

interface Balance {
  id: number;
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: string;
  tag?: string;
}

type BalancesProps = {
  user: any;
};

const Balances = ({ user }: BalancesProps) => {
  const [visible, setVisible] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);

  const onCreate = async (values: any) => {
    const res = await axios.post(`${BASE_URL}/wallet/`, values, {
      headers: { Authorization: `Bearer ${user.token}` },
      timeout: 5000,
    });
    console.log(res);
    message.success("Query created successfully");
    setVisible(false);
    setBalances((prevBalances) => [...prevBalances, res.data.balance]);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/`, {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 5000,
      })
      .then((res) => {
        console.log(res);
        setBalances(res.data.balances || []);
      })
      .catch((error) => {
        const err = error as AxiosError<any>;
        console.log(err);
        if (err.response?.data) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      });
  }, []);

  const onDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${BASE_URL}/wallet/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 5000,
      });
      console.log(res);
      message.success("Query deleted successfully");
      setBalances((prevBalances) =>
        prevBalances.filter((balance) => balance.id !== id)
      );
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
                <DeleteOutlined
                  key="delete"
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
              <Card.Meta
                title={
                  balance.balance
                    ? balance.balance + " " + balance.symbol
                    : "Cannot get balance"
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
