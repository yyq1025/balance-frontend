import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.less";
import HomePage from "./views/Home";
import LoginPage from "./views/Login";
import RegisterPage from "./views/Register";
import ResetPage from "./views/Reset";
import AccountPage from "./views/Account";

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/reset" element={<ResetPage />} />
    <Route path="/account" element={<AccountPage />} />
  </Routes>
);

export default App;
