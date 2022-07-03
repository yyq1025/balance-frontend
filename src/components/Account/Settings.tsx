import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { Layout, Typography, Input, Button, Divider, Form } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
const { Content } = Layout;

type SettingsProps = {
  user: any;
};

const Settings = ({ user }: SettingsProps) => {
  const dispatch = useAppDispatch();

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
      <Form layout="vertical" initialValues={{ email: user.email }}>
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Code">
          <Input.Group compact>
            <Form.Item
              name="code"
              noStyle
              rules={[
                {
                  required: true,
                  message: "Please input the code you got!",
                },
              ]}
            >
              <Input style={{ width: "70%" }} />
            </Form.Item>
            <Button style={{ width: "30%" }} type="primary">
              Get code
            </Button>
          </Input.Group>
        </Form.Item>
        <Form.Item label="New Password">
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
      <Button
        type="primary"
        danger
        onClick={() => dispatch({ type: "LOGOUT" })}
      >
        Logout
      </Button>
    </Content>
  );
};

export default Settings;
