import React from "react";
import { Layout } from "antd";
import "./index.css";
import SignUp from "../../components/SignUp";
import Navbar from "../../components/Navbar";
const { Header, Footer, Sider, Content } = Layout;

const RegisterPage = () => (
  <Layout>
    <Header>
      <Navbar />
    </Header>
    <Content>
      <SignUp />
    </Content>
    <Footer style={{ textAlign: "center" }}>Copyright © WitEx.io 2022</Footer>
  </Layout>
);

export default RegisterPage;
