import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
  Drawer,
  Toolbar,
  AppBar,
  IconButton,
  Fab,
  Typography,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./features/Navbar";
import QueryButton from "./features/balances/QueryButton";
// const { Header, Sider, Content } = Layout;

const drawerWidth = 240;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const onClick: MenuProps["onClick"] = (e) => {
  //   navigate(`${e.key}`, { replace: true });
  // };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <Sider
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      > */}
      <AppBar
        position="fixed"
        color="inherit"
        // style={{
        //   position: "fixed",
        //   zIndex: 1,
        //   width: "calc(100% - 200px)",
        //   backgroundColor: "inherit",
        // }}
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Navbar title={location.pathname.substring(1) || "networks"} />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Toolbar>
            <Typography variant="h6">Balance</Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/"}
                onClick={() => navigate("/")}
              >
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Networks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/queries"}
                onClick={() => navigate("/queries")}
              >
                <ListItemIcon>
                  <QueryStatsIcon />
                </ListItemIcon>
                <ListItemText primary="Queries" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Toolbar>
            <Typography variant="h6">Balance</Typography>
          </Toolbar>
          <Divider />
          {/* <div
          style={{
            height: "32px",
            margin: "16px",
            background: "rgba(0, 0, 0, 0.2)",
          }}
        /> */}
          {/* <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={onClick}
          items={[
            {
              key: "/",
              icon: <GlobalOutlined />,
              label: "Networks",
            },
            {
              key: "/wallets",
              icon: <WalletOutlined />,
              label: "Wallets",
            },
          ]}
        /> */}
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/"}
                onClick={() => navigate("/")}
              >
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Networks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/queries"}
                onClick={() => navigate("/queries")}
              >
                <ListItemIcon>
                  <QueryStatsIcon />
                </ListItemIcon>
                <ListItemText primary="Queries" />
              </ListItemButton>
            </ListItem>
          </List>
          {/* <div style={{ margin: "auto" }}> */}
          <Box sx={{ m: "16px" }}>
            {isAuthenticated ? (
              <QueryButton
                // type="primary"
                // shape="round"
                variant="extended"
                color="primary"
                disabled={!user?.email_verified}
                // icon={<PlusOutlined />}
                // block
              >
                <AddIcon sx={{ mr: 1 }} />
                Add query
              </QueryButton>
            ) : (
              <Fab
                // type="primary"
                // shape="round"
                // icon={<LoginOutlined />}
                // block
                variant="extended"
                color="primary"
                onClick={loginWithRedirect}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            )}
          </Box>
          {/* </div> */}
        </Drawer>
      </Box>
      {/* </Sider> */}
      {/* <Layout style={{ marginLeft: "200px", minHeight: "100vh" }}> */}

      {/* <Content
        style={{
          marginTop: "64px",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      > */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      {/* </Content> */}
      {/* </Layout> */}
      {isAuthenticated ? (
        <QueryButton
          // type="primary"
          // shape="round"
          variant="extended"
          color="primary"
          disabled={!user?.email_verified}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { sm: "none" },
          }}
          // icon={<PlusOutlined />}
          // block
        >
          <AddIcon sx={{ mr: 1 }} />
          Add query
        </QueryButton>
      ) : (
        <Fab
          // type="primary"
          // shape="round"
          // icon={<LoginOutlined />}
          // block
          variant="extended"
          color="primary"
          onClick={loginWithRedirect}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { sm: "none" },
          }}
        >
          <LoginIcon sx={{ mr: 1 }} />
          Login
        </Fab>
      )}
    </Box>
  );
};

export default App;
