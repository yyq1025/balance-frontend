import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Container, { ContainerProps } from "@mui/material/Container";
import { GridProps } from "@mui/material/Grid";
import { useAuth0 } from "@auth0/auth0-react";
// import Actions from "../features/balances/QueryButton";
import Balances from "../features/balances/Balances";

const QueriesView = ({ ...props }: ContainerProps) => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  return (
    <Container {...props}>
      {isAuthenticated ? (
        user?.email_verified ? (
          <Balances />
        ) : (
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>Verify your email to add queries
          </Alert>
        )
      ) : (
        <Alert
          severity="info"
          action={
            <Button color="inherit" onClick={loginWithRedirect}>
              Login
            </Button>
          }
        >
          <AlertTitle>Info</AlertTitle>Login to check balances
        </Alert>
      )}
    </Container>
  );
};

export default QueriesView;
