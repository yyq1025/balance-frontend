import React from "react";
import { Space, Card } from "antd";
import Actions from "../../features/balances/Actions";
import Balances from "../../features/balances/Balances";

const Wallets = () => (
  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
    <Card>
      <Actions />
    </Card>
    <Balances />
  </Space>
);

export default Wallets;
