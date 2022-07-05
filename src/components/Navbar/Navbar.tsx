import React, { useEffect } from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { Row, Button, Space, Avatar, Typography } from "antd";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuthData } from "../../slices/authSlice";
import { logout } from "../../slices/utils";
import { useNavigate, Link, useLocation } from "react-router-dom";
import jwt_decode, { JwtPayload } from "jwt-decode";
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthData);

  const dispatch = useAppDispatch();
  const location = useLocation();

  // Logout when token expired
  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = jwt_decode<JwtPayload>(token);

      if (!decodedToken.exp || decodedToken.exp * 1000 < new Date().getTime())
        dispatch(logout());
    }
  }, [location]);

  return (
    <Row justify="space-between">
      <Link to="/">
        <HomeOutlined style={{ fontSize: "20px", color: "white" }} />
      </Link>
      {user?.email ? (
        <Link to="/account/balances">
          <Space>
            {/* <Avatar
              icon={<UserOutlined />}
              style={{
                color: "white",
                backgroundColor: "transparent",
                border: "1.5px solid",
              }}
            /> */}
            <UserOutlined style={{ fontSize: "20px", color: "white" }} />
            <Text style={{ color: "white" }}>{user.email}</Text>
          </Space>
        </Link>
      ) : (
        <Space>
          <Button
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Sign up
          </Button>
          <Button
            type="text"
            style={{ color: "white" }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Sign in
          </Button>
        </Space>
      )}
    </Row>
  );
};

export default Navbar;
