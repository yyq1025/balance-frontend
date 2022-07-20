import React from "react";
import Alert from "@mui/material/Alert";
import Container, { ContainerProps } from "@mui/material/Container";
import { GridProps } from "@mui/material/Grid";
import { useAuth0 } from "@auth0/auth0-react";
// import Actions from "../features/balances/QueryButton";
import Balances from "../features/balances/Balances";

const QueriesView = ({ ...props }: ContainerProps) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Container {...props}>
      {isAuthenticated ? (
        user?.email_verified ? (
          <Balances />
        ) : (
          <Alert severity="warning">Verify your email to add queries</Alert>
        )
      ) : (
        <Alert severity="info">Login to add queries</Alert>
      )}
    </Container>
  );
};

export default QueriesView;
