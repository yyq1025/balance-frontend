import React, { ReactNode } from "react";
import { Form, Input, FormItemProps } from "antd";
import isEmail from "validator/lib/isEmail";
const { Item } = Form;

interface EmailProps extends FormItemProps {
  placeholder?: string;
  prefix?: ReactNode;
}

const Email = ({ placeholder, prefix, ...props }: EmailProps) => {
  return (
    <Item
      {...props}
      name="email"
      rules={[
        {
          validator: (_, value) => {
            if (isEmail(value)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("The input is not valid E-mail!"));
          },
        },
      ]}
    >
      <Input prefix={prefix} placeholder={placeholder} />
    </Item>
  );
};

export default Email;
