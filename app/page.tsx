"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { isTokenValid } from "./utils/auth";
import { useLoading } from "./context/LoadingContext";
import { useToast } from "./context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const accion = "Login";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    showLoading();

    try {
      const response = await axios.post(
        "https://primary-production-e16cb.up.railway.app/webhook-test/auth",
        {
          email,
          password,
          accion,
        }
      );

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        router.push("/inicio"); // redirige si quieres
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Verifica tus credenciales",
        "error"
      );
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  useEffect(() => {
    const { valid, payload } = isTokenValid();
    if (valid) {
      router.replace("/inicio");
    }
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", alignItems: "center", height: "100vh" }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Entrar"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
