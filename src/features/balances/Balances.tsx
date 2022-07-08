import React, { useEffect } from "react";
import { Row, Col, RowProps } from "antd";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalancesLoaded,
  selectBalanceIds,
  fetchBalances,
} from "./balancesSlice";
import { selectAuthData } from "../../common/authSlice";
import Balance from "./Balance";

const Balances = ({ ...props }: RowProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthData);
  const balanceIds = useAppSelector(selectBalanceIds);
  const loaded = useAppSelector(selectBalancesLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchBalances(user?.token));
    }
  }, []);

  return (
    <Row {...props} gutter={[16, 16]}>
      {balanceIds.map((balanceId) => (
        <Col span={6} key={balanceId}>
          <Balance balanceId={balanceId} />
        </Col>
      ))}
    </Row>
  );
};

export default Balances;
