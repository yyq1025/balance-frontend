import React, { useEffect } from "react";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Constants";
import { Code } from "../Utils";
import "./index.css";
const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, values, {
        timeout: 5000,
      });
      console.log(res);
      message.success(res.data.message);
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError<any>;
      console.log(err);
      if (err.response?.data) {
        message.error(err.response.data.message);
      } else {
        message.error(err.message);
      }
    }
    setSubmitting(false);
  };

  return (
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
        <Code email={email} />
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
  );
};

export default Register;
