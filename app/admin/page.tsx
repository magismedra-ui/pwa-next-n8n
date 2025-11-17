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
import axios from "axios";
import { Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

const TABLES = [
  { key: "publicador", label: "Publicadores" },
  { key: "usuario", label: "Usuarios" },
  { key: "registro", label: "Registros" },
  { key: "role", label: "Roles" },
  { key: "grupo", label: "Grupos" },
];

export default function AdminPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tab, setTab] = useState("publicadorrr");
  const [openMenu, setOpenMenu] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const { showLoading, hideLoading } = useLoading();
    const { showToast } = useToast();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔥 Obtener datos desde N8N
  useEffect(() => {
    //setLoading(true);
    showLoading();
    let data = JSON.stringify({
      tabla: tab,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://primary-production-e16cb.up.railway.app/webhook-test/gestiondb",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data || []);
        hideLoading();
      })
      .catch((error) => {
        console.log("Error al obtener datos:", error?.response?.data || error);
        setData([]);
        hideLoading();
        showToast(error.response?.data[0].message || "Verifica tu conexión a internet",
        "error"
      );
      });
  }, [tab]);

  const creadata = () => {
    console.log("data", form);
    console.log("tabla", tab);
  };

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
        <Box
          sx={{
            width: 250,
            backgroundColor: "#111827",
            height: "100%",
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
          <Button variant="contained" onClick={creadata}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {/* LOADING GLOBAL */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
