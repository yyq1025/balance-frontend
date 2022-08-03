import { Auth0Provider } from "@auth0/auth0-react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarKey, SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./app/App";
import store from "./app/store";
import SnackbarCloseButton from "./features/SnackbarCloseButton";
import theme from "./theme";
import NetworksView from "./views/NetworksView";
import QueriesView from "./views/QueriesView";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ""}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ""}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE || ""}
    >
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            action={(snackbarId: SnackbarKey) => (
              <SnackbarCloseButton snackbarkey={snackbarId} />
            )}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route
                    index
                    element={
                      <NetworksView
                        maxWidth="lg"
                        sx={{ pt: 2, pb: { xs: 10, md: 2 } }}
                      />
                    }
                  />
                  <Route
                    path="queries"
                    element={
                      <QueriesView
                        maxWidth="lg"
                        sx={{ pt: 2, pb: { xs: 10, md: 2 } }}
                      />
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
