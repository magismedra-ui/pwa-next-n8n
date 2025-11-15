import Papa from "papaparse";
import { saveAs } from "file-saver";

export function exportCsv(filename: string, rows: any[]) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
