import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectBalancesLoaded,
  selectBalanceIds,
  fetchBalances,
} from "./balancesSlice";
import Balance from "./Balance";

interface BalancesProps {
  style?: React.CSSProperties;
  className?: string;
}

const Balances = ({ style, className }: BalancesProps) => {
  const dispatch = useAppDispatch();
  const balanceIds = useAppSelector(selectBalanceIds);
  const balancesLoaded = useAppSelector(selectBalancesLoaded);

  useEffect(() => {
    if (!balancesLoaded) {
      dispatch(fetchBalances());
    }
  }, []);

  return (
    <Row gutter={[16, 16]} style={style} className={className}>
      {balanceIds.map((balanceId) => (
        <Col span={6} key={balanceId}>
          <Balance balanceId={balanceId} />
        </Col>
      ))}
    </Row>
  );
};

export default Balances;
