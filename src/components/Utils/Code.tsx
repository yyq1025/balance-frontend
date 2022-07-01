import React, { useEffect, useState } from "react";
import { KeyOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import validator from "validator";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Constants";

type CodeProps = {
  email: string;
};

export const Code = ({ email }: CodeProps) => {
  const [sending, setSending] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer =
      counter > 0
        ? setInterval(() => setCounter(counter - 1), 1000)
        : undefined;
    return () => clearInterval(timer);
  }, [counter]);

  const onClick = async () => {
    console.log(email);
    setSending(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/code`,
        {
          email: email,
        },
        { timeout: 10000 }
      );
      console.log(res);
      message.success(res.data.message);
      setCounter(60);
    } catch (error) {
      console.log(error);
      const err = error as AxiosError<any>;
      if (err.response?.data) {
        message.error(err.response.data.message);
      } else {
        message.error(err.message);
      }
    }
    setSending(false);
  };

  return (
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
          onClick={onClick}
          loading={sending}
          disabled={
            !email || !validator.isEmail(email) || sending || counter > 0
          }
        >
          {counter > 0 ? `${counter}s` : sending ? "Sending" : "Get code"}
        </Button>
      </Input.Group>
    </Form.Item>
  );
};
