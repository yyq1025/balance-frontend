import React from "react";
import { Space, Card, SpaceProps, Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import Actions from "../features/balances/QueryButton";
import Balances from "../features/balances/Balances";

const Wallets = ({ ...props }: SpaceProps) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Space {...props} direction="vertical" size="middle">
      {isAuthenticated ? (
        user?.email_verified ? (
          <Balances />
        ) : (
          <Card>Verify your email to add queries</Card>
        )
      ) : (
        <Card>Login to add queries</Card>
      )}
      {/* <Card>
        {isAuthenticated ? (
          <Actions />
        ) : (
          <Button icon={<LoginOutlined />} onClick={loginWithRedirect}>
            Login to add queries
          </Button>
        )}
      </Card>
      {isAuthenticated && <Balances />} */}
    </Space>
  );
};

export default Wallets;
