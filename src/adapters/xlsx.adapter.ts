import type { Adapter, ParsedData } from "../types";
import * as XLSX from "xlsx";

export const xlsxAdapter: Adapter = {
  canRead(file) {
    return /\.xlsx?$/.test(file);
  },
  async read(file, opts = {}): Promise<ParsedData> {
    const wb = XLSX.readFile(file, { cellDates: true });
    const sheet = opts.sheet ?? wb.SheetNames[0];
    const ws = typeof sheet === "number" ? wb.Sheets[wb.SheetNames[sheet]] : wb.Sheets[sheet];
    if (!ws) throw new Error(`Sheet not found: ${sheet}`);
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" }) as Record<string, any>[];
    return { data: rows, meta: { sheet } };
  }
};
