import React, { useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid, { GridProps } from "@mui/material/Grid";
// import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import {
  selectNetworkNames,
  selectNetworksStatus,
  selectNetworksError,
  fetchNetworks,
} from "./networksSlice";
import Network from "./Network";

const Networks = ({ ...props }: GridProps) => {
  const dispatch = useAppDispatch();
  const networkNames = useAppSelector(selectNetworkNames);
  const status = useAppSelector(selectNetworksStatus);
  const error = useAppSelector(selectNetworksError);

  // const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNetworks());
      // .unwrap()
      // .catch((error: string) => enqueueSnackbar(error, { variant: "error" }));
    }
  }, []);

  return (
    <>
      {status === "loading" && (
        <CircularProgress
          color="inherit"
          sx={{ display: "block", mx: "auto" }}
        />
      )}
      {status === "failed" && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => dispatch(fetchNetworks())}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {status === "succeeded" && (
        <Grid {...props} container spacing={2}>
          {networkNames.map((networkName) => (
            <Grid item md={4} sm={6} xs={12} key={networkName}>
              <Network networkName={networkName} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Networks;
