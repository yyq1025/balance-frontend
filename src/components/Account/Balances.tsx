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
import {
  selectBalancesLoaded,
  selectBalanceIds,
  fetchBalances,
  addBalance,
} from "../../slices/balancesSlice";
import {
  selectNetworksLoaded,
  fetchNetworks,
} from "../../slices/networksSlice";
import QueryCreateForm from "./QueryCreateForm";
import Balance from "./Balance";

const Balances = () => {
  const dispatch = useAppDispatch();
  const balanceIds = useAppSelector(selectBalanceIds);
  const balancesLoaded = useAppSelector(selectBalancesLoaded);
  const networksLoaded = useAppSelector(selectNetworksLoaded);

  const [visible, setVisible] = useState(false);

  const onCreate = async (values: any) => {
    await dispatch(addBalance(values));
    setVisible(false);
  };

  useEffect(() => {
    if (!networksLoaded) {
      dispatch(fetchNetworks());
    }
    if (!balancesLoaded) {
      dispatch(fetchBalances());
    }
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
        {balanceIds.map((balanceId) => (
          <Col span={6} key={balanceId}>
            <Balance balanceId={balanceId} />
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default Balances;
