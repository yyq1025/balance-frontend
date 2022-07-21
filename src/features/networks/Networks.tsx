import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid, { GridProps } from "@mui/material/Grid";
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import Network from "./Network";
import {
  fetchNetworks,
  selectNetworkNames,
  selectNetworksError,
  selectNetworksStatus,
} from "./networksSlice";

const Networks = ({ ...props }: GridProps) => {
  const dispatch = useAppDispatch();
  const networkNames = useAppSelector(selectNetworkNames);
  const status = useAppSelector(selectNetworksStatus);
  const error = useAppSelector(selectNetworksError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNetworks());
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
