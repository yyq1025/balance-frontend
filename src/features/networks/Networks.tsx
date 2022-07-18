import React, { useEffect } from "react";
import { message } from "antd";
import Grid, { GridProps } from "@mui/material/Grid";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import {
  selectNetworkNames,
  selectNetworksLoaded,
  fetchNetworks,
} from "./networksSlice";
import Network from "./Network";

const Networks = ({ ...props }: GridProps) => {
  const dispatch = useAppDispatch();
  const networkNames = useAppSelector(selectNetworkNames);
  const loaded = useAppSelector(selectNetworksLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchNetworks())
        .unwrap()
        .catch((error: string) => message.error(error));
    }
  }, []);

  return (
    <Grid {...props} container spacing={2}>
      {networkNames.map((networkName) => (
        <Grid item md={4} sm={6} xs={12} key={networkName}>
          <Network networkName={networkName} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Networks;
