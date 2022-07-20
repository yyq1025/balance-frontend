import React from "react";
import {
  Button,
  ToolbarProps,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth0 } from "@auth0/auth0-react";
// const { Text } = Typography;

interface NavbarProps extends ToolbarProps {
  title: string;
}

const Navbar = ({ title, ...props }: NavbarProps) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* <Text
        style={{
          fontSize: "24px",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {title}
      </Text> */}
      <Typography
        variant="h6"
        sx={{ flexGrow: 1, textTransform: "capitalize" }}
      >
        {title}
      </Typography>
      {isAuthenticated ? (
        <>
          <IconButton onClick={handleClick}>
            <Avatar src={user?.picture} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={logoutWithRedirect}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </>
      ) : (
        // <Dropdown
        //   overlay={
        //     <Menu
        //       items={[
        //         {
        //           key: "logout",
        //           icon: <LogoutOutlined />,
        //           label: "Logout",
        //           onClick: logoutWithRedirect,
        //         },
        //       ]}
        //     />
        //   }
        //   trigger={["click"]}
        // >
        //   <Button type="text" icon={<UserOutlined />}>
        //     {user?.email}
        //   </Button>
        // </Dropdown>
        <Button
          // type="primary"
          // icon={<LoginOutlined />}
          variant="outlined"
          startIcon={<LoginIcon />}
          onClick={loginWithRedirect}
        >
          Login
        </Button>
      )}
    </>
  );
};

export default Navbar;
