import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { reset } from "../../slices/authSlice";
import { logout } from "../../slices/utils";
// import { reset } from "../../actions/auth";
import { Code } from "../Utils";
import { Layout, Typography, Input, Button, Divider, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { PoweroffOutlined } from "@ant-design/icons";
const { Content } = Layout;

type SettingsProps = {
  email: string;
};

const Settings = ({ email }: SettingsProps) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // const [form] = Form.useForm();
  // const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(reset({ values, navigate }));
    setSubmitting(false);
  };

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        backgroundColor: "#fff",
      }}
    >
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Reset Password</Typography.Title>
      </Divider>
      <Form
        onFinish={onFinish}
        disabled={submitting}
        layout="vertical"
        initialValues={{ email: email }}
      >
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <Code email={email} label="Code" />
        <Form.Item name="password" label="New Password">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Reset password
          </Button>
        </Form.Item>
      </Form>
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Logout</Typography.Title>
      </Divider>
      <Button type="primary" danger onClick={() => dispatch(logout())}>
        Logout
      </Button>
    </Content>
  );
};

export default Settings;
