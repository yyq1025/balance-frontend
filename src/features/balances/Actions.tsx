import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch } from "../../common/hooks";
import { addBalance } from "./balancesSlice";
import QueryCreateForm from "./QueryCreateForm";
import type { QueryForm } from "../../common/types";

const Actions = () => {
  const dispatch = useAppDispatch();
  const { user, getAccessTokenSilently } = useAuth0();
  const [visible, setVisible] = useState(false);

  const onCreate = async (values: QueryForm) => {
    await dispatch(addBalance({ getAccessTokenSilently, values }));
    setVisible(false);
  };

  return (
    <>
      {user?.email_verified ? (
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
      ) : (
        "Verify your email to add a query"
      )}
    </>
  );
};

export default Actions;
