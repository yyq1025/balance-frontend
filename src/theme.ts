import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        "#root": { display: "flex", minHeight: "100vh" },
        [themeParam.breakpoints.down("sm")]: {
          ".SnackbarContainer-bottom": { bottom: "72px !important" },
        },
      }),
    },
  },
});

export default theme;
