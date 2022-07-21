import React, { useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid, { GridProps } from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalancesStatus,
  selectBalancesError,
  selectBalanceIds,
  fetchBalances,
} from "./balancesSlice";
import QueryButton from "./QueryButton";
import Balance from "./Balance";

const Balances = ({ ...props }: GridProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const balanceIds = useAppSelector(selectBalanceIds);
  const status = useAppSelector(selectBalancesStatus);
  const error = useAppSelector(selectBalancesError);

  // const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBalances({ getAccessTokenSilently }));
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
            <Button
              color="inherit"
              onClick={() =>
                dispatch(fetchBalances({ getAccessTokenSilently }))
              }
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {status === "succeeded" &&
        (balanceIds.length > 0 ? (
          <Grid {...props} container spacing={2}>
            {balanceIds.map((balanceId) => (
              <Grid item md={4} sm={6} xs={12} key={balanceId}>
                <Balance balanceId={balanceId} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert
            severity="success"
            action={
              <QueryButton
                render={(disabled, onClick) => (
                  <Button color="inherit" onClick={onClick} disabled={disabled}>
                    Add query
                  </Button>
                )}
              />
            }
          >
            <AlertTitle>Login Success</AlertTitle>Try to add your first query
          </Alert>
        ))}
    </>
  );
};

export default Balances;
