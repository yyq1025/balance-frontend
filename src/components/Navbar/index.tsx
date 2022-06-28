import { UserOutlined } from "@ant-design/icons";
import { Row, Button, Space, Avatar, Typography } from "antd";
import { useAppSelector } from "../../hooks";
import { useNavigate, Link } from "react-router-dom";
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authData);
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
