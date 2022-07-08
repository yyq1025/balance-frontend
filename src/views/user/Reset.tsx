import React, { useState } from "react";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Form, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../common/hooks";
import { reset } from "../../common/authSlice";
import Email from "../../common/Email";
import Code from "../../common/Code";
import Password from "../../common/Password";
import type { ResetForm } from "../../common/types";
const { Item } = Form;
const { Title } = Typography;

const Reset = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [form] = Form.useForm<ResetForm>();
  const email = Form.useWatch("email", form);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: ResetForm) => {
    console.log("Received values of form: ", values);
    setSubmitting(true);
    await dispatch(reset({ values, navigate }));
    setSubmitting(false);
  };

  return (
    <>
      <Title level={3}>Reset password</Title>
      <Form
        style={{ paddingTop: "16px" }}
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
          placeholder="New Password"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
        <Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={submitting}
          >
            Reset password
          </Button>
          Or <Link to="/user/login">login now!</Link>
        </Item>
      </Form>
    </>
  );
};

export default Reset;
