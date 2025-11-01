'use client';

import { useRouter } from "next/navigation";
import { Container, Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@test.com" && password === "123456") {
      localStorage.setItem("auth", "true");
      router.push("/products");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", height: "100vh" }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Bienvenido
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
          >
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
