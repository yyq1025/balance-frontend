import React from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, MenuProps, Breadcrumb } from "antd";
import { WalletOutlined, SettingOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../common/hooks";
import { selectAuthData } from "../../common/authSlice";
const { Sider } = Layout;

const Account = () => {
  const user = useAppSelector(selectAuthData);

  const navigate = useNavigate();
  const location = useLocation();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e.key);
    navigate(`/account/${e.key}`, { replace: true });
  };

  return (
    <>
      {user ? (
        <Layout hasSider>
          <Sider
            theme="light"
            style={{
              marginTop: "64px",
              overflow: "auto",
              height: "100%",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname.split("/").at(-1) || ""]}
              onClick={onClick}
              items={[
                {
                  key: "wallets",
                  icon: <WalletOutlined />,
                  label: "Wallets",
                },
                {
                  key: "settings",
                  icon: <SettingOutlined />,
                  label: "Settings",
                },
              ]}
            />
          </Sider>
          <Layout
            style={{
              marginTop: "64px",
              marginLeft: "200px",
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb style={{ margin: "16px 0" }}>
              {location.pathname.split("/").map((path, index) => (
                <Breadcrumb.Item key={index}>{path}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <Outlet />
          </Layout>
        </Layout>
      ) : (
        <Navigate to="/user/login" />
      )}
    </>
  );
};

export default Account;
