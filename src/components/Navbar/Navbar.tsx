import React, { useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Row, Button, Space, Avatar, Typography } from "antd";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate, Link, useLocation } from "react-router-dom";
import jwt_decode, { JwtPayload } from "jwt-decode";
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authData);

  const dispatch = useAppDispatch();
  const location = useLocation();

  // Logout when token expired
  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = jwt_decode<JwtPayload>(token);

      if (!decodedToken.exp || decodedToken.exp * 1000 < new Date().getTime())
        dispatch({ type: "LOGOUT" });
    }
  }, [location]);

  return (
    <>
      <Row justify="space-between">
        <Link
          to="/"
          style={{
            float: "left",
            width: "120px",
            height: "31px",
            margin: "16px 24px 16px 0",
            background: "rgba(255, 255, 255, 0.3)",
          }}
        />
        {user?.email ? (
          <Link to="/account/balances">
            <Space>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  color: "white",
                  backgroundColor: "transparent",
                  border: "1.5px solid",
                }}
              />
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
    </>
  );
};

export default Navbar;
