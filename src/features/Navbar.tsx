import React, { useEffect } from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { Row, Button, Space, Typography, Avatar } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector, useAppDispatch } from "../common/hooks";
// import { selectAuthData } from "../common/authSlice";
// import { logout } from "../common/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import jwt_decode, { JwtPayload } from "jwt-decode";
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  // const user = useAppSelector(selectAuthData);

  // const dispatch = useAppDispatch();
  // const location = useLocation();

  // // Logout when token expired
  // useEffect(() => {
  //   const token = user?.token;

  //   if (token) {
  //     const decodedToken = jwt_decode<JwtPayload>(token);

  //     if (!decodedToken.exp || decodedToken.exp * 1000 < new Date().getTime())
  //       dispatch(logout());
  //   }
  // }, [location]);

  return (
    <Row justify="space-between" align="middle">
      <Link to="/">
        <HomeOutlined style={{ fontSize: "20px", color: "white" }} />
      </Link>
      {isAuthenticated ? (
        <Link to="/account/wallets">
          <Space>
            <Avatar src={user?.picture} />
            {/* <UserOutlined style={{ fontSize: "20px", color: "white" }} /> */}
            <Text style={{ color: "white" }}>{user?.email}</Text>
          </Space>
        </Link>
      ) : (
        // <Space>
        //   <Button
        //     type="primary"
        //     onClick={(e) => {
        //       e.preventDefault();
        //       navigate("/user/register", { replace: true });
        //     }}
        //   >
        //     Sign up
        //   </Button>
        //   <Button
        //     type="text"
        //     style={{ color: "white" }}
        //     onClick={(e) => {
        //       e.preventDefault();
        //       navigate("/user/login", { replace: true });
        //     }}
        //   >
        //     Sign in
        //   </Button>
        // </Space>
        <Button type="primary" onClick={() => loginWithRedirect()}>
          Log in
        </Button>
      )}
    </Row>
  );
};

export default Navbar;
