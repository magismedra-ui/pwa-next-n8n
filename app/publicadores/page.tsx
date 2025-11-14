"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "../utils/auth";

const PublicadoresPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { valid, payload } = isTokenValid();
    if (!valid) {
      router.replace("/");
      return;
    }

    // axios
    //   .get("/api/products")
    //   .then((res) => setProducts(res.data))
    //   .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  return (
    <div>
      <h1>Publicadores</h1>
    </div>
  );
};

export default PublicadoresPage;
