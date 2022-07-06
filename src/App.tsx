import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./features/Navbar";
import "./App.less";
const { Header } = Layout;

const App = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
      <Navbar />
    </Header>
    <Outlet />
  </Layout>
);

export default App;
