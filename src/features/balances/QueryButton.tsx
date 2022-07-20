import React, { useState } from "react";
import Fab, { FabProps } from "@mui/material/Fab";
import Button from "@mui/material/Button";
import { useSnackbar, SnackbarKey } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { addBalance } from "./balancesSlice";
import QueryCreateForm from "./QueryCreateForm";
import type { QueryForm } from "../../common/types";

const QueryButton = ({ ...props }: FabProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently, user } = useAuth0();
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const action = (snackbarId: SnackbarKey) => (
    <Button
      variant="text"
      color="inherit"
      onClick={() => navigate("/queries")}
      key={snackbarId}
    >
      View
    </Button>
  );

  const onCreate = async (values: QueryForm) => {
    await dispatch(addBalance({ getAccessTokenSilently, values })).unwrap();
    enqueueSnackbar("Query added", { variant: "success", action });
    setVisible(false);
  };

  return (
    <>
      <Fab {...props} onClick={() => setVisible(true)} />
      <QueryCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default QueryButton;
