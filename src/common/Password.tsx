import React, { ReactNode } from "react";
import { Form, Input, FormItemProps } from "antd";
import isStrongPassword from "validator/lib/isStrongPassword";
const { Item } = Form;

interface PasswordProps extends FormItemProps {
  strong?: boolean;
  placeholder?: string;
  prefix?: ReactNode;
}

const Password = ({ strong, placeholder, prefix, ...props }: PasswordProps) => {
  return (
    <Item
      {...props}
      name="password"
      rules={[
        {
          validator: (_, value) => {
            if (!strong || isStrongPassword(value)) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error("The Password is not strong enough!")
            );
          },
        },
      ]}
    >
      <Input.Password prefix={prefix} placeholder={placeholder} />
    </Item>
  );
};

export default Password;
