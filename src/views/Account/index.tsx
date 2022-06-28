import React from "react";
import { Layout, Typography, Menu } from "antd";
import {
  WalletOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Navbar from "../../components/Navbar";
import "./index.css";
const { Header, Footer, Sider, Content } = Layout;

const AccountPage = () => {
  const user = useAppSelector((state) => state.authData);
  const dispatch = useAppDispatch();

  return (
    <>
      {!user && <Navigate to="/login" />}
      <Layout>
        <Header>
          <Navbar />
        </Header>
        <Layout>
          <Sider collapsible>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <WalletOutlined />,
                  label: "Wallets",
                },
                {
                  key: "2",
                  icon: <SettingOutlined />,
                  label: "Settings",
                },
                {
                  key: "3",
                  icon: <PoweroffOutlined />,
                  label: "Logout",
                  onClick: () => {
                    dispatch({ type: "LOGOUT" });
                  },
                },
              ]}
            />
          </Sider>
          <Content></Content>
        </Layout>

        <Footer style={{ textAlign: "center" }}>
          Copyright © WitEx.io 2022
        </Footer>
      </Layout>
    </>
  );
};

export default AccountPage;
