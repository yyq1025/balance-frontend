import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
// import { reset, logout, selectAuthData } from "../../common/authSlice";
// import Code from "../../common/Code";
// import Password from "../../common/Password";
import { Layout, Typography, Input, Button, Divider, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// import type { ResetForm } from "../../common/types";
const { Content } = Layout;

const Settings = () => {
  const dispatch = useAppDispatch();
  const { logout } = useAuth0();
  const logoutWithRedirect = () => {
    logout({
      returnTo: window.location.origin,
    });
  };
  const navigate = useNavigate();

  // const user = useAppSelector(selectAuthData);

  // const [submitting, setSubmitting] = useState(false);

  // const onFinish = async (values: ResetForm) => {
  //   console.log("Received values of form: ", values);
  //   setSubmitting(true);
  //   await dispatch(reset({ values, navigate }));
  //   setSubmitting(false);
  // };

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        backgroundColor: "#fff",
      }}
    >
      {/* <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Reset Password</Typography.Title>
      </Divider>
      <Form
        style={{ width: "100%", maxWidth: "480px" }}
        onFinish={onFinish}
        disabled={submitting}
        layout="vertical"
        initialValues={{ email: user.email }}
      >
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <Code email={user.email} label="Code" />
        <Password label="New Password" strong />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Reset password
          </Button>
        </Form.Item>
      </Form> */}
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Logout</Typography.Title>
      </Divider>
      <Button type="primary" danger onClick={() => logoutWithRedirect()}>
        Logout
      </Button>
    </Content>
  );
};

export default Settings;
