import React from "react";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthData, reset } from "../../slices/authSlice";
// import { reset } from "../../actions/auth";
import { Code } from "../Utils";
const { Title } = Typography;

const Reset = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthData);

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(reset({ values, navigate }));
    setSubmitting(false);
  };

  return (
    <>
      {user ? (
        <Navigate to="/account/balances" />
      ) : (
        <div className="forget">
          <Title level={3}>Reset password</Title>
          <Form
            className="forget-form"
            onFinish={onFinish}
            form={form}
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
            <Code
              email={email}
              placeholder="Code"
              prefix={<KeyOutlined className="site-form-item-icon" />}
            />
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
                placeholder="New Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="forget-form-button"
                loading={submitting}
              >
                Reset password
              </Button>
              Or <Link to="/login">login now!</Link>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default Reset;
