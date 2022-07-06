import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../../common/hooks";
import { selectAuthData } from "../../common/authSlice";

const User = () => {
  const user = useAppSelector(selectAuthData);

  return (
    <>
      {user ? (
        <Navigate to="/account/wallets" />
      ) : (
        <div style={{ width: "100%", maxWidth: "330px", margin: "auto" }}>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default User;
