import React from "react";
import { Layout, Typography, Input, Button, Divider, Form } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
const { Content } = Layout;

const Settings = () => {
  const { logout } = useAuth0();
  const logoutWithRedirect = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        backgroundColor: "#fff",
      }}
    >
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Logout</Typography.Title>
      </Divider>
      <Button type="primary" danger onClick={() => logoutWithRedirect()}>
        Logout
      </Button>
    </Content>
  );
};

export default Settings;
