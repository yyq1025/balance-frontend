import { useAuth0 } from "@auth0/auth0-react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid, { GridProps } from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { ErrorMessage } from "../../common/types";
import Balance from "./Balance";
import {
  fetchBalances,
  selectBalanceIds,
  selectBalancesError,
  selectBalancesPage,
  selectBalancesStatus,
} from "./balancesSlice";
import QueryButton from "./QueryButton";

const Balances = ({ ...props }: GridProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const balanceIds = useAppSelector(selectBalanceIds);
  const status = useAppSelector(selectBalancesStatus);
  const error = useAppSelector(selectBalancesError);
  const page = useAppSelector(selectBalancesPage);

  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <InfiniteScroll
        loadMore={async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(fetchBalances({ token }));
          } catch (error) {
            enqueueSnackbar((error as ErrorMessage).message, {
              variant: "error",
            });
          }
        }}
        hasMore={page !== -1 && status !== "failed"}
        threshold={100}
      >
        <Grid {...props} container spacing={2}>
          {balanceIds.map((balanceId) => (
            <Grid item lg={4} sm={6} xs={12} key={balanceId}>
              <Balance balanceId={balanceId} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
      {status === "loading" && (
        <CircularProgress
          color="inherit"
          sx={{ display: "block", mx: "auto", mt: 2 }}
        />
      )}
      {status === "failed" && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={async () => {
                try {
                  const token = await getAccessTokenSilently();
                  dispatch(fetchBalances({ token }));
                } catch (error) {
                  enqueueSnackbar((error as ErrorMessage).message, {
                    variant: "error",
                  });
                }
              }}
            >
              Retry
            </Button>
          }
          sx={{ mt: 2 }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {status === "succeeded" && balanceIds.length === 0 && (
        <Alert
          severity="success"
          action={
            <QueryButton
              render={(params) => (
                <Button {...params} color="inherit">
                  Add query
                </Button>
              )}
            />
          }
        >
          <AlertTitle>Login Success</AlertTitle>Try to add your first query
        </Alert>
      )}
    </>
  );
};

export default Balances;
