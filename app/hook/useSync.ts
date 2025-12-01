import { useCallback } from "react";
import { db } from "../db/dexie";

export function useSync() {
  const pushChange = useCallback(
    async (
      tabla: string,
      tipo: "CREATE" | "UPDATE" | "DELETE",
      payload: any
    ) => {
      const change = {
        tabla,
        tipo,
        payload,
        timestamp: Date.now(),
      };
      await db.changes.add(change);

      try {
        // send pending to server to attempt immediate sync
        const pending = await db.changes.toArray();
        const res = await fetch("/api/sync-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pending }),
        });
        if (res.ok) {
          const json = await res.json();
          // On success, remove processed (server returns processed ids ideally)
          // For simplicity, clear all pending if server responded success
          if (json && json.success) {
            await Promise.all(
              pending.map((p) => db.changes.delete(p.id as number))
            );
          }
        } else {
          // register background sync if available
          if (
            "serviceWorker" in navigator &&
            navigator.serviceWorker.controller
          ) {
            try {
              navigator.serviceWorker.controller.postMessage({
                type: "TRIGGER_SYNC",
              });
            } catch (e) {}
          }
        }
      } catch (e) {
        // offline; background sync will pick it up
        if (
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller
        ) {
          try {
            navigator.serviceWorker.controller.postMessage({
              type: "TRIGGER_SYNC",
            });
          } catch (e) {}
        }
      }
    },
    []
  );

  const flushPending = useCallback(async () => {
    const pending = await db.changes.toArray();
    if (!pending.length) return;

    try {
      const res = await fetch("/api/sync-pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pending }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          await Promise.all(
            pending.map((p) => db.changes.delete(p.id as number))
          );
        }
      }
    } catch (e) {
      // keep it for later
    }
  }, []);

  return { pushChange, flushPending };
}
