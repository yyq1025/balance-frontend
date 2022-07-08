import React, { ReactNode, useEffect, useState } from "react";
import { Button, Form, Input, message, FormItemProps } from "antd";
import isEmail from "validator/lib/isEmail";
import axios, { AxiosError } from "axios";
import isInt from "validator/lib/isInt";
import { code } from "../api";
import type { ErrorResponse } from "./types";
const { Item } = Form;

interface CodeProps extends FormItemProps {
  email: string;
  placeholder?: string;
  prefix?: ReactNode;
}

const Code = ({ email, placeholder, prefix, ...props }: CodeProps) => {
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
      const res = await code(email);
      console.log(res);
      message.success(res.data.message);
      setCounter(60);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ErrorResponse>;
        if (err.response?.data) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
    }
    setSending(false);
  };

  return (
    <Item {...props}>
      <Input.Group compact>
        <Item
          name="code"
          noStyle
          rules={[
            {
              validator: (_, value) => {
                if (isInt(value, { min: 0, max: 999999 })) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The input is not valid code!")
                );
              },
            },
          ]}
        >
          <Input
            prefix={prefix}
            placeholder={placeholder}
            style={{ width: "70%" }}
          />
        </Item>
        <Button
          style={{ width: "30%" }}
          type="primary"
          onClick={onClick}
          loading={sending}
          disabled={!email || !isEmail(email) || sending || counter > 0}
        >
          {counter > 0 ? `${counter}s` : sending ? "Sending" : "Get code"}
        </Button>
      </Input.Group>
    </Item>
  );
};

export default Code;
