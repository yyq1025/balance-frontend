import React, { useEffect } from "react";
import { Avatar, MenuProps, Space } from "antd";
import {
  Layout,
  Typography,
  Menu,
  Breadcrumb,
  Input,
  Button,
  Row,
  Col,
  Card,
} from "antd";
import {
  WalletOutlined,
  SettingOutlined,
  PoweroffOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Navbar from "../../components/Navbar";
import QueryCreateForm from "./QueryCreateForm";
import { BASE_URL } from "../../constants";
import "./index.css";
const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

interface Balance {
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: number;
  tag: string | null;
}

const AccountPage = () => {
  const user = useAppSelector((state) => state.authData);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { item } = useParams();

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      dispatch({ type: "LOGOUT" });
    } else {
      console.log(e.key);
      navigate(`/account/${e.key}`, { replace: true });
    }
  };

  const [visible, setVisible] = React.useState(false);

  const onCreate = (values: any) => {
    console.log("Received values of form: ", JSON.stringify(values));
    fetch(`${BASE_URL}/wallet`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setVisible(false);
  };

  const [balances, setBalances] = React.useState<Balance[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/wallet/balance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setBalances(res.wallets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {!user && <Navigate to="/login" />}
      {!item && <Navigate to="./balances" />}
      <Layout>
        <Header>
          <Navbar />
        </Header>
        <Layout>
          <Sider collapsible theme="light">
            <Menu
              mode="inline"
              selectedKeys={[item || "balances"]}
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
                {
                  key: "logout",
                  icon: <PoweroffOutlined />,
                  label: "Logout",
                },
              ]}
            />
          </Sider>
          <Content style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Account</Breadcrumb.Item>
              <Breadcrumb.Item>Balances</Breadcrumb.Item>
            </Breadcrumb>
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
                    <Card
                      title={
                        <Typography.Title
                          level={5}
                          copyable={!balance.tag}
                          ellipsis={{ tooltip: true }}
                        >
                          {balance.tag || balance.address}
                        </Typography.Title>
                      }
                      actions={[
                        <EditOutlined key="edit" />,
                        <DeleteOutlined key="delete" />,
                      ]}
                    >
                      <Card.Meta
                        title={balance.balance + " " + balance.symbol}
                        description={balance.network}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </Content>
        </Layout>

        <Footer style={{ textAlign: "center" }}>
          Copyright © WitEx.io 2022
        </Footer>
      </Layout>
    </>
  );
};

export default AccountPage;
