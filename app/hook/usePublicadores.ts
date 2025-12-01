import { useEffect, useState, useCallback } from 'react';
import { db, Publicador } from '../db/dexie';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';

export function usePublicadores() {
  const [items, setItems] = useState<Publicador[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const loadLocal = useCallback(async () => {
    const local = await db.publicadores.toArray();
    if (local && local.length) {
      setItems(local);
      const latest = local.reduce((a, b) => (a.updated_at && b.updated_at && a.updated_at > b.updated_at ? a : b));
      setLastUpdated(latest?.updated_at ?? null);
    }
  }, []);

  const revalidate = useCallback(async () => {
    showLoading();
    try {
      const url = lastUpdated ? `/api/publicador?changed_after=${encodeURIComponent(lastUpdated)}` : `/api/publicador`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al obtener publicadores');
      const body = await res.json();
      if (body.success) {
        const changed: Publicador[] = body.data || [];
        if (changed.length > 0) {
          await db.transaction('rw', db.publicadores, async () => {
            for (const p of changed) {
              await db.publicadores.put(p);
            }
          });
          const all = await db.publicadores.toArray();
          setItems(all);
          const latest = all.reduce((a, b) => (a.updated_at && b.updated_at && a.updated_at > b.updated_at ? a : b));
          setLastUpdated(latest?.updated_at ?? null);
        } else if (!items.length) {
          const all = await db.publicadores.toArray();
          setItems(all);
        }
      } else {
        showToast(body.message || 'Error al sincronizar publicadores', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error de red', 'error');
    } finally {
      hideLoading();
    }
  }, [lastUpdated, showLoading, hideLoading, showToast]);

  useEffect(() => {
    (async () => {
      await loadLocal();
      await revalidate();
    })();
  }, [loadLocal, revalidate]);

  return { items, revalidate, setItems };
}
