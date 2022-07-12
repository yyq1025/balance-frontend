import React from "react";
import { Space, Card, SpaceProps, Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import Actions from "../features/balances/Actions";
import Balances from "../features/balances/Balances";

const Wallets = ({ ...props }: SpaceProps) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <Space {...props} direction="vertical" size="middle">
      <Card>
        {isAuthenticated ? (
          <Actions />
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={loginWithRedirect}
          >
            Login to add queries
          </Button>
        )}
      </Card>
      {isAuthenticated && <Balances />}
    </Space>
  );
};

export default Wallets;
