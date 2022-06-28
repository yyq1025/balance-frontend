import React from "react";
import { Layout, Typography } from "antd";
import SignIn from "../../components/SignIn";
import Navbar from "../../components/Navbar";
import "./index.css";
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const LoginPage = () => (
  <Layout>
    <Header>
      <Navbar />
    </Header>
    <Content>
      <SignIn />
    </Content>
    <Footer style={{ textAlign: "center" }}>Copyright © WitEx.io 2022</Footer>
  </Layout>
);

export default LoginPage;
