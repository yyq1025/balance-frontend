import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectNetworkNames,
  selectNetworksLoaded,
  fetchNetworks,
} from "../networks/networksSlice";
import { isAddress } from "@ethersproject/address";
import type { ErrorResponse, QueryForm } from "../../common/types";

interface QueryCreateFormProps {
  visible: boolean;
  onCreate: (values: QueryForm) => Promise<void>;
  onCancel: () => void;
}

const QueryCreateForm = ({
  visible,
  onCreate,
  onCancel,
}: QueryCreateFormProps) => {
  const dispatch = useAppDispatch();
  const networksLoaded = useAppSelector(selectNetworksLoaded);
  const networkNames = useAppSelector(selectNetworkNames);

  const navigate = useNavigate();

  const [form] = Form.useForm<QueryForm>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!networksLoaded) {
      dispatch(fetchNetworks())
        .unwrap()
        .catch((error: string) => message.error(error));
    }
  }, []);

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
          await onCreate(values);
          form.resetFields();
          navigate("/wallets");
        } catch (error) {
          console.error(error);
          if (typeof error === "string") {
            message.error(error);
          }
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
              message: "Please enter an address",
            },
            {
              validator: (_, value) => {
                if (value && !isAddress(value)) {
                  return Promise.reject(
                    new Error("The input is not valid address!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input allowClear />
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
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {networkNames.map((networkName) => (
              <Select.Option key={networkName} value={networkName}>
                {networkName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="token"
          label="Token"
          rules={[
            {
              validator: (_, value) => {
                if (value && !isAddress(value)) {
                  return Promise.reject(
                    new Error("The input is not valid address!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input allowClear placeholder="Leave empty to query native token" />
        </Form.Item>
        <Form.Item name="tag" label="Tag">
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QueryCreateForm;
