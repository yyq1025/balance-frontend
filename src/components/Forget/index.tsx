import React from "react";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";
import "./index.css";
const { Title } = Typography;

const Forget = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = React.useState(false);
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    const timer =
      counter > 0
        ? setInterval(() => setCounter(counter - 1), 1000)
        : undefined;
    return () => clearInterval(timer);
  }, [counter]);

  const sendCode = () => {
    if (form.getFieldError("email").length > 0) {
      console.log(form.getFieldError("email"));
      return;
    }
    console.log(email);
    fetch(BASE_URL + "/user/code", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCounter(60);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    fetch(BASE_URL + "/user/password", {
      method: "PUT",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
    setSubmitting(false);
  };

  return (
    <div className="forget">
      <Title level={3}>Reset password</Title>
      <Form
        className="forget-form"
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
        <Form.Item>
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
              <Input
                prefix={<KeyOutlined className="site-form-item-icon" />}
                placeholder="Code"
                style={{ width: "70%" }}
              />
            </Form.Item>
            <Button
              style={{ width: "30%" }}
              type="primary"
              onClick={sendCode}
              disabled={counter > 0}
            >
              {counter > 0 ? `${counter}s` : "Get code"}
            </Button>
          </Input.Group>
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default Forget;
