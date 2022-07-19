import React, { useState } from "react";
import { Button, ButtonProps } from "antd";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { addBalance } from "./balancesSlice";
import QueryCreateForm from "./QueryCreateForm";
import type { QueryForm } from "../../common/types";

const QueryButton = ({ ...props }: ButtonProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const [visible, setVisible] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onCreate = async (values: QueryForm) => {
    await dispatch(addBalance({ getAccessTokenSilently, values })).unwrap();
    enqueueSnackbar("Query added", { variant: "success" });
    setVisible(false);
  };

  return (
    <>
      <Button {...props} onClick={() => setVisible(true)} />
      <QueryCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default QueryButton;
