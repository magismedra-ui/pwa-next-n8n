"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNavWrapper from "./BottomNavWrapper";
import { Box } from "@mui/material";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === "/";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",         // clave
        minHeight: 0            // clave para evitar overflow del contenedor
      }}
    >
      {!hideHeader && <Header />}

      {/* ⬇️ Contenedor scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",      // aquí scrollea la lista
          paddingBottom: "16px",
          paddingTop: hideHeader ? 0 : "8px",
        }}
      >
        {children}
      </div>
    </div>
  );
}