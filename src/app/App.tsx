import { useAuth0 } from "@auth0/auth0-react";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import PublicIcon from "@mui/icons-material/Public";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import QueryButton from "../features/balances/QueryButton";
import UserButton from "../features/UserButton";

const drawerWidth = 240;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, loginWithRedirect, error, isLoading } = useAuth0();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (isLoading) {
    return (
      <Box sx={{ m: "auto" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: "auto" }}>
        <AlertTitle>Error</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  const drawer = (
    <>
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
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={trigger ? 4 : 0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textTransform: "capitalize" }}
          >
            {location.pathname.substring(1) || "networks"}
          </Typography>
          <UserButton />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
          <Box sx={{ m: 2 }}>
            {isAuthenticated ? (
              <QueryButton
                render={(params) => (
                  <Fab {...params} color="primary" variant="extended" id="Fab">
                    <AddIcon sx={{ mr: 1 }} />
                    Add query
                  </Fab>
                )}
              />
            ) : (
              <Fab
                color="primary"
                variant="extended"
                onClick={loginWithRedirect}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            )}
          </Box>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { md: "none" },
        }}
      >
        {isAuthenticated ? (
          <QueryButton
            render={(params) => (
              <Fab {...params} color="primary" variant="extended">
                <AddIcon sx={{ mr: 1 }} />
                Add query
              </Fab>
            )}
          />
        ) : (
          <Fab color="primary" variant="extended" onClick={loginWithRedirect}>
            <LoginIcon sx={{ mr: 1 }} />
            Login
          </Fab>
        )}
      </Box>
    </>
  );
};

export default App;
