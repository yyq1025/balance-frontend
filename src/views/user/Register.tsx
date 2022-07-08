import React, { useState } from "react";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../common/hooks";
import { register } from "../../common/authSlice";
import Email from "../../common/Email";
import Code from "../../common/Code";
import Password from "../../common/Password";
import type { RegisterForm } from "../../common/types";
const { Item } = Form;
const { Title } = Typography;

const Register = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [form] = Form.useForm<RegisterForm>();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: RegisterForm) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(register({ values, navigate }));
    setSubmitting(false);
  };

  return (
    <>
      <Title level={3}>Register</Title>
      <Form
        style={{ paddingTop: "16px" }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        form={form}
        disabled={submitting}
      >
        <Email
          placeholder="Email"
          prefix={<MailOutlined className="site-form-item-icon" />}
        />
        <Code
          email={email}
          placeholder="Code"
          prefix={<KeyOutlined className="site-form-item-icon" />}
        />
        <Password
          strong
          placeholder="Password"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
        <Item
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
        </Item>

        <Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={submitting}
          >
            Register
          </Button>
          Or <Link to="/user/login">login now!</Link>
        </Item>
      </Form>
    </>
  );
};

export default Register;
