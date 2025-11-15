"use client";
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useAuth from "../hook/useAuth";

export default function TopBar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { payload, logout } = useAuth(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="static" elevation={1} color="inherit">
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <IconButton onClick={onOpenSidebar}><MenuIcon /></IconButton>
        <Typography variant="h6" sx={{ flex: 1 }}>Admin Dashboard</Typography>

        <IconButton><DarkModeIcon /></IconButton>

        <Box>
          <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
            <Avatar>{(payload?.nombre?.charAt(0) || "U").toUpperCase()}</Avatar>
          </IconButton>

          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
            <MenuItem disabled>{payload?.nombre}</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); logout(); }}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
