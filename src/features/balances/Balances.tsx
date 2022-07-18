import React, { useEffect } from "react";
import { message } from "antd";
import Grid, { GridProps } from "@mui/material/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalancesLoaded,
  selectBalanceIds,
  fetchBalances,
} from "./balancesSlice";
import Balance from "./Balance";

const Balances = ({ ...props }: GridProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const balanceIds = useAppSelector(selectBalanceIds);
  const loaded = useAppSelector(selectBalancesLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchBalances({ getAccessTokenSilently }))
        .unwrap()
        .catch((error: string) => message.error(error));
    }
  }, []);

  return (
    <Grid {...props} container spacing={2}>
      {balanceIds.map((balanceId) => (
        <Grid item md={4} sm={6} xs={12} key={balanceId}>
          <Balance balanceId={balanceId} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Balances;
