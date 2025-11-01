import { NextResponse } from "next/server";
import apiClient from "../../libs/apiClient";

export async function GET() {
  try {
    const { data } = await apiClient.get("/products");
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en API interna:", error.message);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
