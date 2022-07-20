import React from "react";
import { Alert } from "@mui/material";
import { GridProps } from "@mui/material/Grid";
import { useAuth0 } from "@auth0/auth0-react";
// import Actions from "../features/balances/QueryButton";
import Balances from "../features/balances/Balances";

const Queries = ({ ...props }: GridProps) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <>
      {isAuthenticated ? (
        user?.email_verified ? (
          <Balances {...props} />
        ) : (
          <Alert severity="warning">Verify your email to add queries</Alert>
        )
      ) : (
        <Alert severity="info">Login to add queries</Alert>
      )}
      {/* <Card>
        {isAuthenticated ? (
          <Actions />
        ) : (
          <Button icon={<LoginOutlined />} onClick={loginWithRedirect}>
            Login to add queries
          </Button>
        )}
      </Card>
      {isAuthenticated && <Balances />} */}
    </>
  );
};

export default Queries;
