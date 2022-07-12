import React, { useEffect } from "react";
import { Row, Col, RowProps } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalancesLoaded,
  selectBalanceIds,
  fetchBalances,
} from "./balancesSlice";
import Balance from "./Balance";

const Balances = ({ ...props }: RowProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const balanceIds = useAppSelector(selectBalanceIds);
  const loaded = useAppSelector(selectBalancesLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchBalances({ getAccessTokenSilently }));
    }
  }, []);

  return (
    <Row {...props} gutter={[16, 16]}>
      {balanceIds.map((balanceId) => (
        <Col span={8} key={balanceId}>
          <Balance balanceId={balanceId} />
        </Col>
      ))}
    </Row>
  );
};

export default Balances;
