import React from "react";
import { MenuProps } from "antd";
import { Layout, Menu, Breadcrumb, Input } from "antd";
import { WalletOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuthData } from "../../slices/authSlice";
import Balances from "./Balances";
import Settings from "./Settings";
const { Sider } = Layout;

const Account = () => {
  const user = useAppSelector(selectAuthData);

  const navigate = useNavigate();
  const { item } = useParams();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e.key);
    navigate(`/account/${e.key}`, { replace: true });
  };

  return (
    <>
      {user ? (
        <Layout>
          <Sider collapsible theme="light">
            <Menu
              mode="inline"
              selectedKeys={[item || ""]}
              onClick={onClick}
              items={[
                {
                  key: "balances",
                  icon: <WalletOutlined />,
                  label: "Balances",
                },
                {
                  key: "settings",
                  icon: <SettingOutlined />,
                  label: "Settings",
                },
              ]}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Account</Breadcrumb.Item>
              <Breadcrumb.Item>{item}</Breadcrumb.Item>
            </Breadcrumb>
            {item == "balances" && <Balances />}
            {item == "settings" && <Settings email={user.email} />}
          </Layout>
        </Layout>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default Account;
