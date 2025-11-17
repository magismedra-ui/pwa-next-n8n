"use client";

import { ToastProvider } from "../context/ToastContext";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { LoadingProvider } from "../context/LoadingContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeader = pathname === "/";

  return (
    <ToastProvider>
      <LoadingProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "100%", // clave
            minHeight: 0, // clave para evitar overflow del contenedor
          }}
        >
          {!hideHeader && <Header />}

          {/* ⬇️ Contenedor scrollable */}
          <div
            style={{
              flex: 1,
              overflowY: "auto", // aquí scrollea la lista
              paddingBottom: "16px",
              paddingTop: hideHeader ? 0 : "8px",
            }}
          >
            {children}
          </div>
        </div>
      </LoadingProvider>
    </ToastProvider>
  );
}
