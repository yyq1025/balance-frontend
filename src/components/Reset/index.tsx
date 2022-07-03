import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Constants";
import { Code } from "../Utils";
const { Title } = Typography;

const Reset = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    try {
      const res = await axios.put(`${BASE_URL}/user/password`, values, {
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
  );
};

export default Reset;
