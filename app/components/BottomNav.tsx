// components/BottomNav.jsx
"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CampaignIcon from "@mui/icons-material/Campaign";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { usePathname, useRouter } from "next/navigation";
import { isTokenValid } from "../utils/auth";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [role, setRole] = React.useState<string | null>(null);

  const routes = ["/inicio", "/informes", "/publicadores", "/admin"];

  // Selección de item
  let currentValue = routes.findIndex(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  // Si estás en "/", forzar inicio
  if (pathname === "/") {
    currentValue = 0;
  }

  // Si no coincide ninguna ruta → evitar -1
  if (currentValue === -1) {
    currentValue = 0; // MUI requiere número → uso 0 por seguridad
  }

  const handleChange = (event: any, newValue: number) => {
    router.push(routes[newValue]);
  };

   React.useEffect(() => {
    const { valid, payload } = isTokenValid();
    if (valid) setRole(payload.role);
  }, []);

  return (
    <Paper
  sx={{
    width: "100%",
    borderRadius: 0,
  }}
  elevation={6}
>
  <BottomNavigation value={currentValue} onChange={handleChange} showLabels>
    <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
    <BottomNavigationAction label="Informes" icon={<AssessmentIcon />} />
    <BottomNavigationAction label="Publs" icon={<CampaignIcon />} />
    {/* Solo mostrar si es admin */}
      {role === "Admin" && (
        <BottomNavigationAction label="Admin" icon={<AdminPanelSettingsIcon />} />
      )}
  </BottomNavigation>
</Paper>
  );
}