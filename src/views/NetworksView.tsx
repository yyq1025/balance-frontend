import React from "react";
import Container, { ContainerProps } from "@mui/material/Container";
import Networks from "../features/networks/Networks";

const NetworksView = ({ ...props }: ContainerProps) => (
  <Container {...props}>
    <Networks />
  </Container>
);

export default NetworksView;
