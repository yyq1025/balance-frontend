import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import App from "./App";
import Networks from "./views/Networks";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./app/store";
import Wallets from "./views/Wallets";

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
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route
                  index
                  element={
                    <Networks
                      // sx={{
                      //   maxWidth: "900px",
                      // }}
                      maxWidth="md"
                    />
                  }
                />
                <Route
                  path="wallets"
                  element={
                    <Wallets
                      style={{
                        maxWidth: "900px",
                        width: "100%",
                      }}
                    />
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>{" "}
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
