import React from "react";
import { Row, Button, Typography, RowProps, Dropdown, Menu } from "antd";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
const { Text } = Typography;

interface NavbarProps extends RowProps {
  title: string;
}

const Navbar = ({ title, ...props }: NavbarProps) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  return (
    <Row {...props} justify="space-between" align="middle">
      <Text
        style={{
          fontSize: "24px",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {title}
      </Text>
      {isAuthenticated ? (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  onClick: logoutWithRedirect,
                },
              ]}
            />
          }
          trigger={["click"]}
        >
          <Button type="text" icon={<UserOutlined />}>
            {user?.email}
          </Button>
        </Dropdown>
      ) : (
        <Button
          // type="primary"
          icon={<LoginOutlined />}
          onClick={loginWithRedirect}
        >
          Login
        </Button>
      )}
    </Row>
  );
};

export default Navbar;
