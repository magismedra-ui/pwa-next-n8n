import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPdf(filename: string, rows: any[]) {
  const doc = new jsPDF();

  if (!rows || rows.length === 0) {
    doc.text("No hay datos para exportar", 10, 10);
    doc.save(filename);
    return;
  }

  // Obtener columnas automáticamente
  const columns = Object.keys(rows[0]);

  // Convertir filas en formato de tabla
  const tableRows = rows.map((row) =>
    columns.map((col) => row[col] ?? "")
  );

  // Agregar título
  doc.setFontSize(16);
  doc.text("Reporte de datos", 14, 15);

  // Crear tabla
  autoTable(doc, {
    startY: 25,
    head: [columns],
    body: tableRows,
  });

  doc.save(filename);
}
