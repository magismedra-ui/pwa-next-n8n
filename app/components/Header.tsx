"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "../utils/auth";

export default function Header() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");

  const formatName = (name: string) => {
    if (!name) return "";
    name = name.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  useEffect(() => {
    const { valid, payload } = isTokenValid();

    // Si el token NO es válido → mandar al login
    if (!valid) {
      router.replace("/");
      return;
    }

    const rawName = payload?.nombre || "Usuario";
    const firstName = rawName.split(" ")[0];
    setNombre(formatName(firstName));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle1" sx={{ fontSize: "0.9rem" }}>
          Hola, {nombre}
        </Typography>

        <Button color="inherit" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}