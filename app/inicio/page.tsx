"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { isTokenValid } from "../utils/auth";

export default function InicioPage() {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const { valid } = isTokenValid();

    // CORRECTO: si NO es válido → login
    if (!valid) {
      router.replace("/");
      return;
    }

    // Si es válido → cargar productos
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Productos Disponibles
      </Typography>
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card
              sx={{ borderRadius: 3, boxShadow: 4, ":hover": { boxShadow: 8 } }}
            >
              <CardContent>
                <Typography variant="h6">{p.title}</Typography>
                <Typography color="text.secondary">${p.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

