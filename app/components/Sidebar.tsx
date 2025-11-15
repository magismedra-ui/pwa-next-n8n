"use client";
import React from "react";
import { Drawer, List, ListItemButton, ListItemText, Box, Divider, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { key: "role", label: "Roles" },
  { key: "usuario", label: "Usuarios" },
  { key: "publicador", label: "Publicadores" },
  { key: "registro", label: "Registros" },
  { key: "grupo", label: "Grupos" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ width: 260, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose}><ChevronLeftIcon /></IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List>
          {NAV.map((n) => (
            <ListItemButton
              key={n.key}
              selected={pathname.includes(n.key)}
              onClick={() => { onClose(); router.push(`/admin?table=${n.key}`); }}
            >
              <ListItemText primary={n.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
