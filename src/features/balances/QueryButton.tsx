import React, { useState } from "react";
import Fab, { FabProps } from "@mui/material/Fab";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import { useSnackbar, SnackbarKey } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { addBalance } from "./balancesSlice";
import QueryCreateForm from "./QueryCreateForm";
import type { QueryForm } from "../../common/types";

const QueryButton = ({ ...props }: FabProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, user } =
    useAuth0();
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

  return (
    <>
      <Fab
        {...props}
        disabled={isAuthenticated && !user?.email_verified}
        onClick={() =>
          isAuthenticated ? setVisible(true) : loginWithRedirect()
        }
      >
        {isAuthenticated ? (
          <>
            <AddIcon sx={{ mr: 1 }} />
            Add query
          </>
        ) : (
          <>
            <LoginIcon sx={{ mr: 1 }} />
            Login
          </>
        )}
      </Fab>
      <QueryCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default QueryButton;
