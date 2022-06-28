import React from "react";
import { Layout } from "antd";
import "./index.css";
import Forget from "../../components/Forget";
import Navbar from "../../components/Navbar";
const { Header, Footer, Sider, Content } = Layout;

const ResetPage = () => (
  <Layout>
    <Header>
      <Navbar />
    </Header>
    <Content>
      <Forget />
    </Content>
    <Footer style={{ textAlign: "center" }}>Copyright © WitEx.io 2022</Footer>
  </Layout>
);

export default ResetPage;
