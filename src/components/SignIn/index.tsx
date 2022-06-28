import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../constants";
import { useAppDispatch } from "../../hooks";
import "./index.css";
const { Title } = Typography;

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    fetch(BASE_URL + "/user/login", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((res) => {
        const email = res?.email;
        const token = res?.token;
        dispatch({ type: "LOGIN", payload: { email, token } });
        navigate("/account");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login">
      <Title level={3}>Login</Title>
      <Form
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
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
          >
            Login
          </Button>
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
