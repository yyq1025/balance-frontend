import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Row, Button, Space, Avatar, Typography } from "antd";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useNavigate, Link, useLocation } from "react-router-dom";
import jwt_decode, { JwtPayload } from "jwt-decode";
import "./Navbar.css";
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authData);

  const dispatch = useAppDispatch();
  const location = useLocation();

  // Logout when token expired
  React.useEffect(() => {
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
        <Link to="/" className="logo" />
        {user?.email ? (
          <Link to="/account">
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
