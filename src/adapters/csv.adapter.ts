import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import type { Adapter, ParsedData } from "../types";

export const csvAdapter: Adapter = {
    canRead(file) {
      return /\.csv$/i.test(file);
    },
    async read(file, opts = {}): Promise<ParsedData> {
      const text = await fs.readFile(file, "utf-8");
      const records = parse(text, { columns: true, skip_empty_lines: true, trim: true });
      const clean = records.map((row: any) => {
        const normalized: Record<string, any> = {};
        for (const [k, v] of Object.entries(row)) {
          const key = k.replace(/^\uFEFF/, "").trim().replace(/\s+/g, "");
          normalized[key] = v;
        }
        return normalized;
      });
  
      return { data: clean };
    }
  };
