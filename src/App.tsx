import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./components/Navbar";
import "./App.less";
const { Header } = Layout;

const App = () => (
  <Layout>
    <Header>
      <Navbar />
    </Header>
    <Outlet />
  </Layout>
);

export default App;
