import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../common/authSlice";
import { useAppDispatch } from "../../common/hooks";
import Email from "../../common/Email";
import Password from "../../common/Password";
import type { LoginForm } from "../../common/types";
const { Item } = Form;
const { Title } = Typography;

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: LoginForm) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(login({ values, navigate }));
    setSubmitting(false);
  };

  return (
    <>
      <Title level={3}>Login</Title>
      <Form
        style={{ paddingTop: "16px" }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        disabled={submitting}
      >
        <Email
          placeholder="Email"
          prefix={<MailOutlined className="site-form-item-icon" />}
        />
        <Password
          placeholder="Password"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
        <Item>
          <Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Item>

          <Link to="/user/reset" style={{ float: "right" }}>
            Forgot password
          </Link>
        </Item>

        <Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={submitting}
          >
            Login
          </Button>
          Or <Link to="/user/register">register now!</Link>
        </Item>
      </Form>
    </>
  );
};

export default Login;
