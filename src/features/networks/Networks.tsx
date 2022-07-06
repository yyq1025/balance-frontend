import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import {
  selectNetworkNames,
  selectNetworksLoaded,
  fetchNetworks,
} from "./networksSlice";
import Network from "./Network";

const Networks = () => {
  const dispatch = useAppDispatch();
  const networkNames = useAppSelector(selectNetworkNames);
  const loaded = useAppSelector(selectNetworksLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchNetworks());
    }
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {networkNames.map((networkName) => (
        <Col span={8} key={networkName}>
          <Network networkName={networkName} />
        </Col>
      ))}
    </Row>
  );
};

export default Networks;
