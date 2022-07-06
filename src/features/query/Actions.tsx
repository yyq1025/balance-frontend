import React, { useState } from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../common/hooks";
import { addBalance } from "../balances/balancesSlice";
import QueryCreateForm from "./QueryCreateForm";

const Actions = () => {
  const dispatch = useAppDispatch();

  const [visible, setVisible] = useState(false);

  const onCreate = async (values: any) => {
    await dispatch(addBalance(values));
    setVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        Add Query
      </Button>
      <QueryCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default Actions;
