"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0f62fe" },
    secondary: { main: "#00c2a8" },
    background: { default: "#f5f7fb", paper: "#ffffff" },
    text: { primary: "#0f1724" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h5: { fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 10 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

export default theme;
