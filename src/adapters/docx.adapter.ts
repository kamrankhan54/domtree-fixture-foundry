import fs from "fs/promises";
import mammoth from "mammoth";
import type { Adapter, ParsedData } from "../types";
import { extractJsonFromText } from "../utils/aiExtract";

/** Very small HTML helpers */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "\n").replace(/\n{2,}/g, "\n").trim();
}

function tablesToTSV(html: string): string[] {
  // capture each <table>...</table>
  const tables: string[] = [];
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

  const norm = (s: string) =>
    stripTags(s).replace(/\s+/g, " ").trim();

  const matches = html.match(tableRegex) || [];
  for (const tableHtml of matches) {
    const rows = tableHtml.match(rowRegex) || [];
    const tsvRows: string[] = [];
    for (const tr of rows) {
      const cells: string[] = [];
      let m: RegExpExecArray | null;
      cellRegex.lastIndex = 0;
      while ((m = cellRegex.exec(tr))) {
        cells.push(norm(m[2]));
      }
      if (cells.length) tsvRows.push(cells.join("\t"));
    }
    if (tsvRows.length) tables.push(tsvRows.join("\n"));
  }
  return tables;
}

/** Lightweight table → objects (header = first row) */
function tsvToObjects(tsv: string): Record<string, string>[] {
  const rows = tsv.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  if (rows.length < 2) return [];
  const header = rows[0].split("\t").map(h => h.trim());
  const out: Record<string, string>[] = [];
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split("\t");
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => (obj[h] = cols[idx] ?? ""));
    out.push(obj);
  }
  return out;
}

export const docxAdapter: Adapter = {
  canRead(file) {
    return /\.docx$/i.test(file);
  },

  async read(file, options?: { ai?: boolean }): Promise<ParsedData> {
    const buf = await fs.readFile(file);
    const { value: html } = await mammoth.convertToHtml({ buffer: buf });

    const plainText = stripTags(html);         // paragraphs, headings flattened
    const tableTSVs = tablesToTSV(html);       // one TSV string per table

    // --- AI path (recommended) ---
    if (options?.ai) {
      const aiInput = [
        "The following text and (if present) TSV tables were extracted from a DOCX file.",
        "Please return ONLY a JSON array of objects with camelCased keys that best represents the structured data.",
        "",
        "TEXT:",
        plainText || "(none)",
        "",
        ...(tableTSVs.length
          ? ["TABLES (TSV):", ...tableTSVs.map((t, i) => `--- TABLE ${i + 1} ---\n${t}`)]
          : []),
      ].join("\n");

      const data = await extractJsonFromText(aiInput);
      return { data, meta: { tables: tableTSVs.length } };
    }

    // --- Non-AI fallback (simple table parse) ---
    for (const tsv of tableTSVs) {
      const objs = tsvToObjects(tsv);
      if (objs.length) {
        return { data: objs, meta: { tables: tableTSVs.length } };
      }
    }

    // If no tables parsed, return raw text
    return { data: [{ rawText: plainText }], meta: { tables: tableTSVs.length } };
  },
};
