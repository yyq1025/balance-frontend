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
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectBalances } from "../../slices/balancesSlice";
import { addBalance, fetchBalances } from "../../actions/balances";
import QueryCreateForm from "./QueryCreateForm";
import BalanceCard from "./Balance";

const Balances = () => {
  const dispatch = useAppDispatch();
  const balances = useAppSelector(selectBalances);

  const [visible, setVisible] = useState(false);

  const onCreate = async (values: any) => {
    await dispatch(addBalance(values));
    setVisible(false);
  };

  useEffect(() => {
    dispatch(fetchBalances());
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
            <BalanceCard balance={balance} />
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default Balances;
