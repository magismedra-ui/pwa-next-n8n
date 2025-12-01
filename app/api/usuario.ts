import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const N8N = process.env.N8N_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Request a N8N
    const response = await axios.post(
      `${N8N}/webhook-test/usuario`,
      req.body,
      {
        headers: { 'Content-Type': 'application/json' },
        // Permite devolver errores 4xx/5xx sin lanzar excepción
        validateStatus: () => true,
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error connecting to N8N',
      error: error.message || 'Unknown error',
    });
  }
}
