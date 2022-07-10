import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Row, Button, Space, Typography, Avatar } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
const { Text } = Typography;

const Navbar = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

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
        <Button type="primary" onClick={() => loginWithRedirect()}>
          Log in
        </Button>
      )}
    </Row>
  );
};

export default Navbar;
