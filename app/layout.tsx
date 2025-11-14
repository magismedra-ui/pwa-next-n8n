// app/layout.tsx (o layout.js / layout.jsx)
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./libs/theme";
import BottomNavWrapper from "./components/BottomNavWrapper";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import ClientLayout from "./components/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
      </head>

      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <ClientLayout>{children}</ClientLayout>
            <BottomNavWrapper /> {/* FOOTER fijo */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
