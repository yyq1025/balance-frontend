import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { selectAuthData, login } from "../../slices/authSlice";
// import { login } from "../../actions/auth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
const { Title } = Typography;

const Login = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthData);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(login({ values, navigate }));
    setSubmitting(false);
  };

  return (
    <>
      {user ? (
        <Navigate to="/account/balances" replace={true} />
      ) : (
        <div className="login">
          <Title level={3}>Login</Title>
          <Form
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            disabled={submitting}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link to="/reset" className="login-form-forgot">
                Forgot password
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={submitting}
              >
                Login
              </Button>
              Or <Link to="/register">register now!</Link>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default Login;
