import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { selectAuthData } from "../../common/authSlice";
import { addBalance } from "../balances/balancesSlice";
import QueryCreateForm from "./QueryCreateForm";
import type { QueryForm } from "../../common/types";

const Actions = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthData);
  const [visible, setVisible] = useState(false);

  const onCreate = async (values: QueryForm) => {
    await dispatch(addBalance({ token: user.token, values }));
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
