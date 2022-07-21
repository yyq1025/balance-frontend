import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import { SnackbarKey, useSnackbar } from "notistack";
import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import type { QueryForm } from "../../common/types";
import { selectNetworksStatus } from "../networks/networksSlice";
import { addBalance } from "./balancesSlice";
import QueryCreateForm from "./QueryCreateForm";

interface QueryButtonProps {
  render: (RenderProps: {
    disabled: boolean;
    onClick: () => void;
  }) => ReactNode;
}

const QueryButton = ({ render }: QueryButtonProps) => {
  const dispatch = useAppDispatch();
  const networksStatus = useAppSelector(selectNetworksStatus);
  const { getAccessTokenSilently, user } = useAuth0();
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId: SnackbarKey) => (
    <Button
      variant="text"
      color="inherit"
      onClick={() => {
        navigate("/queries");
        closeSnackbar(snackbarId);
      }}
    >
      View
    </Button>
  );

  const onCreate = async (values: QueryForm) => {
    await dispatch(addBalance({ getAccessTokenSilently, values })).unwrap();
    enqueueSnackbar("Query added", { variant: "success", action });
    setVisible(false);
  };

  const disabled = networksStatus !== "succeeded" || !user?.email_verified;
  const onClick = () => setVisible(true);

  return (
    <>
      {render({ disabled, onClick })}
      <QueryCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default QueryButton;
