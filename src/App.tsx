import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SnackbarProvider, useSnackbar, SnackbarKey } from "notistack";
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
  Typography,
  Fab,
  Alert,
  AlertTitle,
  CircularProgress,
  useScrollTrigger,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./features/Navbar";
import QueryButton from "./features/balances/QueryButton";

const drawerWidth = 240;

const SnackbarCloseButton = ({ snackbarkey }: { snackbarkey: SnackbarKey }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        closeSnackbar(snackbarkey);
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        "& .SnackbarContainer-bottom": {
          bottom: { xs: "72px !important", sm: "14px !important" },
        },
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ m: "auto" }}>
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      ) : isLoading ? (
        <CircularProgress
          color="inherit"
          sx={{ display: "block", m: "auto" }}
        />
      ) : (
        <SnackbarProvider
          action={(snackbarId: SnackbarKey) => (
            <SnackbarCloseButton snackbarkey={snackbarId} />
          )}
        >
          <AppBar
            position="fixed"
            color="inherit"
            elevation={trigger ? 4 : 0}
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
              {drawer}
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
              {drawer}
              <Box sx={{ m: 2 }}>
                {isAuthenticated ? (
                  <QueryButton
                    render={({ disabled, onClick }) => (
                      <Fab
                        color="primary"
                        variant="extended"
                        onClick={onClick}
                        disabled={disabled}
                      >
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
              width: { sm: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
            }}
          >
            <Toolbar />
            <Outlet />
          </Box>
          {isAuthenticated ? (
            <QueryButton
              render={({ disabled, onClick }) => (
                <Fab
                  color="primary"
                  variant="extended"
                  onClick={onClick}
                  disabled={disabled}
                  sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    display: { sm: "none" },
                  }}
                >
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
        </SnackbarProvider>
      )}
    </Box>
  );
};

export default App;
