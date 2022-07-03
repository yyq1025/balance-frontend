import React, { useEffect } from "react";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import validator from "validator";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthData } from "../../slices/authSlice";
import { register } from "../../actions/auth";
import { Code } from "../Utils";
const { Title } = Typography;

const Register = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthData);

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(register(values, navigate));
    setSubmitting(false);
  };

  return (
    <>
      {user ? (
        <Navigate to="/account/balances" />
      ) : (
        <div className="register">
          <Title level={3}>Register</Title>
          <Form
            className="register-form"
            initialValues={{
              remember: true,
            }}
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
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Should accept agreement")),
                },
              ]}
            >
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                loading={submitting}
              >
                Register
              </Button>
              Or <Link to="/login">login now!</Link>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default Register;
