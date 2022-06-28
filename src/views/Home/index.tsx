import React from "react";
import { Layout, Typography } from "antd";
import Navbar from "../../components/Navbar";
import "./index.css";
const { Header, Footer, Sider, Content } = Layout;

const HomePage = () => (
  <Layout>
    <Header>
      <Navbar />
    </Header>
    <Content></Content>
    <Footer style={{ textAlign: "center" }}>Copyright © WitEx.io 2022</Footer>
  </Layout>
);

export default HomePage;
