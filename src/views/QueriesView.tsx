import Container, { ContainerProps } from "@mui/material/Container";
import React from "react";

import Balances from "../features/balances/Balances";

const QueriesView = ({ ...props }: ContainerProps) => (
  <Container {...props}>
    <Balances />
  </Container>
);

export default QueriesView;
