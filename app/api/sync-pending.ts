import type { NextApiRequest, NextApiResponse } from 'next';

const N8N = process.env.N8N_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const pending = req.body?.pending;
  if (!pending || !Array.isArray(pending)) {
    return res.status(400).json({ success: false, message: 'Se requiere pending array en el body' });
  }

  const results = [];
  for (const item of pending) {
    try {
      const url = `${N8N}/webhook-test/gestiondb/${item.tabla}`;
      const method = item.tipo === 'CREATE' ? 'POST' : item.tipo === 'UPDATE' ? 'PUT' : 'DELETE';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });
      const json = await r.json().catch(() => ({}));
      results.push({ ok: r.ok, status: r.status, json });
    } catch (e) {
      results.push({ ok: false, error: String(e) });
    }
  }

  return res.status(200).json({ success: true, results });
}
