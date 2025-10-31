import fs from "fs";
import { parse } from "csv-parse";

function toCamel(str: string) {
    return str
      .replace(/^[\uFEFF\s]+|[\s]+$/g, '')       // remove BOM + spaces
      .toLowerCase()
      .replace(/[_\s]+(\w|$)/g, (_, c) => c.toUpperCase());
  }
  

export function parseCsv(file: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    fs.createReadStream(file)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true // <-- this automatically removes the BOM
        })
      )      
      .on("data", r => rows.push(r))
      .on("end", () => {
        const normalized = rows.map(row => {
          const fixed: Record<string, any> = {};
          for (const [key, value] of Object.entries(row)) {
            fixed[toCamel(key)] = value;
          }
          return fixed;
        });
        resolve(normalized);
      })      
      .on("error", reject);
  });
}
