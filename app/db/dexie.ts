import Dexie, { Table } from "dexie";

export interface Publicador {
  id?: string; // UUID or cedula
  cedula?: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  telefono_familiar?: string;
  grupo?: string | number;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PendingChange {
  id?: number;
  tabla: string;
  tipo: "CREATE" | "UPDATE" | "DELETE";
  payload: any;
  timestamp: number;
}

export class AdminDB extends Dexie {
  public publicadores!: Table<Publicador, string | number>;
  public changes!: Table<PendingChange, number>;

  constructor() {
    super("adminDB");
    this.version(1).stores({
      publicadores: "++id, cedula, telefono, updated_at",
      changes: "++id, tabla, tipo, timestamp",
    });
  }
}

export const db = new AdminDB();