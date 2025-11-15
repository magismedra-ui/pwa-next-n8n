"use client";

import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

const TABLES = [
  { key: "role", label: "Roles" },
  { key: "publicador", label: "Publicadores" },
  { key: "registro", label: "Registros" },
  { key: "usuario", label: "Usuarios" },
  { key: "grupo", label: "Grupos" },
];

export default function AdminPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [tab, setTab] = useState("role");
  const [openMenu, setOpenMenu] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Obtener datos desde N8N
  useEffect(() => {
    setLoading(true);

    fetch("https://primary-production-e16cb.up.railway.app/webhook-test/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: tab }),
    })
      .then((res) => res.json())
      .then((data) => setData(data || []))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ─────────────────────────────
        NAV SUPERIOR EN MÓVIL
      ───────────────────────────── */}
      {isMobile && (
        <Box
          sx={{
            height: 60,
            backgroundColor: "#111827",
            color: "white",
            display: "flex",
            alignItems: "center",
            px: 2,
          }}
        >
          <IconButton onClick={() => setOpenMenu(true)} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ ml: 2 }}>
            Admin Panel
          </Typography>
        </Box>
      )}

      {/* ─────────────────────────────
        SIDEBAR DESKTOP
      ───────────────────────────── */}
      {!isMobile && (
        <Box
          sx={{
            width: 250,
            backgroundColor: "#111827",
            color: "white",
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
            Admin Panel
          </Typography>

          {TABLES.map((t) => (
            <Box
              key={t.key}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: t.key === tab ? "#1f2937" : "transparent",
              }}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Box>
          ))}
        </Box>
      )}

      {/* ─────────────────────────────
        DRAWER MOBILE
      ───────────────────────────── */}
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box sx={{ width: 250, backgroundColor: "#111827", height: "100%", color: "white", p: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
            Admin Panel
          </Typography>

          {TABLES.map((t) => (
            <Box
              key={t.key}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: t.key === tab ? "#1f2937" : "transparent",
              }}
              onClick={() => {
                setTab(t.key);
                setOpenMenu(false);
              }}
            >
              {t.label}
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* ─────────────────────────────
        CONTENIDO
      ───────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          p: isMobile ? 1.5 : 3,
          overflow: "hidden",
        }}
      >
        {/* ENCABEZADO */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            Gestión de: {TABLES.find((t) => t.key === tab)?.label}
          </Typography>

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              setForm({});
              setEditingItem(null);
              setOpenModal(true);
            }}
          >
            Crear nuevo
          </Button>
        </Card>

        {/* LISTADO */}
        <Card sx={{ height: isMobile ? "auto" : "70vh", p: 1 }}>
          <DataGrid
            autoHeight={isMobile}
            rows={data}
            columns={[
              ...Object.keys(data[0] || {}).map((col) => ({
                field: col,
                headerName: col.toUpperCase(),
                minWidth: 150,
                flex: 1,
              })),
              {
                field: "actions",
                headerName: "Acciones",
                width: 150,
                renderCell: (params: any) => (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size={isMobile ? "small" : "medium"}
                      onClick={() => {
                        setEditingItem(params.row);
                        setForm(params.row);
                        setOpenModal(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size={isMobile ? "small" : "medium"}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ),
              },
            ]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </Card>
      </Box>

      {/* ─────────────────────────────
        MODAL (RESPONSIVE)
      ───────────────────────────── */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? "Editar registro" : "Crear nuevo"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            {Object.keys(data[0] || { nombre: "" }).map(
              (f) =>
                f !== "id" && (
                  <Grid item xs={12} sm={6} key={f}>
                    <TextField
                      fullWidth
                      label={f}
                      value={form?.[f] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [f]: e.target.value })
                      }
                    />
                  </Grid>
                )
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
