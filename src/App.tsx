import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, MenuProps } from "antd";
import {
  GlobalOutlined,
  WalletOutlined,
  LoginOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./features/Navbar";
import QueryButton from "./features/balances/QueryButton";
import "./App.less";
const { Header, Sider, Content } = Layout;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`${e.key}`, { replace: true });
  };

  return (
    <Layout hasSider>
      <Sider
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: "32px",
            margin: "16px",
            background: "rgba(0, 0, 0, 0.2)",
          }}
        />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={onClick}
          items={[
            {
              key: "/",
              icon: <GlobalOutlined />,
              label: "Networks",
            },
            {
              key: "/wallets",
              icon: <WalletOutlined />,
              label: "Wallets",
            },
          ]}
        />
        <div style={{ margin: "16px" }}>
          {isAuthenticated ? (
            <QueryButton
              type="primary"
              shape="round"
              disabled={!user?.email_verified}
              icon={<PlusOutlined />}
              block
            >
              Add Query
            </QueryButton>
          ) : (
            <Button
              type="primary"
              shape="round"
              icon={<LoginOutlined />}
              block
              onClick={loginWithRedirect}
            >
              Login
            </Button>
          )}
        </div>
      </Sider>
      <Layout style={{ marginLeft: "200px", minHeight: "100vh" }}>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "calc(100% - 200px)",
            backgroundColor: "inherit",
          }}
        >
          <Navbar title={location.pathname.substring(1) || "networks"} />
        </Header>
        <Content
          style={{
            marginTop: "64px",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
