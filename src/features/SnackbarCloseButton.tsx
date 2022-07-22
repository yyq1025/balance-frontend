import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { SnackbarKey, useSnackbar } from "notistack";
import React from "react";

const SnackbarCloseButton = ({ snackbarkey }: { snackbarkey: SnackbarKey }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        closeSnackbar(snackbarkey);
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default SnackbarCloseButton;
