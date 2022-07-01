import React, { useState } from "react";
import { Button, Form, Input, Modal, Radio, Select } from "antd";

interface QueryCreateFormProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const QueryCreateForm = ({
  visible,
  onCreate,
  onCancel,
}: QueryCreateFormProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  return (
    <Modal
      visible={visible}
      title="Create a new query"
      okText="Create"
      okButtonProps={submitting ? { disabled: true, loading: true } : {}}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={async () => {
        setSubmitting(true);
        try {
          const values = await form.validateFields();
          form.resetFields();
          await onCreate(values);
        } catch (info) {
          console.log("Validate Failed:", info);
        }
        setSubmitting(false);
      }}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={submitting}
        initialValues={{ network: "Ethereum" }}
      >
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
