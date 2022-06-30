import { Button, Form, Input, Modal, Radio, Select } from "antd";
import React, { useState } from "react";

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface QueryCreateFormProps {
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const QueryCreateForm = ({
  visible,
  onCreate,
  onCancel,
}: QueryCreateFormProps) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new query"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: Values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input the address for query!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="network"
          label="Network"
          rules={[
            {
              required: true,
              message: "Please select the network for query!",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a network"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            <Select.Option value="Ethereum">Ethereum</Select.Option>
            <Select.Option value="BSC">BSC</Select.Option>
            <Select.Option value="Polygon">Polygon</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="token" label="Token">
          <Input placeholder="Leave empty to query native token" />
        </Form.Item>
        <Form.Item name="tag" label="Tag">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QueryCreateForm;
