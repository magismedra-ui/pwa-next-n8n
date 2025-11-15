const N8N_URL = "https://primary-production-e16cb.up.railway.app/webhook-test/auth";

async function n8nFetch(accion: string, body: any = {}) {
  const res = await fetch(N8N_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accion, ...body }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "N8N request failed");
  }
  return res.json();
}

export const adminApi = {
  list: (tabla: string) => n8nFetch(tabla),
  create: (tabla: string, data: any) => n8nFetch(`${tabla}_crear`, data),
  update: (tabla: string, id: string | number, data: any) => n8nFetch(`${tabla}_actualizar`, { id, ...data }),
  remove: (tabla: string, id: string | number) => n8nFetch(`${tabla}_eliminar`, { id }),
};
