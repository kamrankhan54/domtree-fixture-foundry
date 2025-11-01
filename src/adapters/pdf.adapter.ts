import fs from "fs/promises";
import type { Adapter, ParsedData } from "../types";
import { extractJsonFromText } from "../utils/aiExtract";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-parse");

export const pdfAdapter: Adapter = {
  canRead(file) {
    return /\.pdf$/i.test(file);
  },

  async read(file, options?: { ai?: boolean }): Promise<ParsedData> {
    const buf = await fs.readFile(file);
    const res = await pdf(buf);

    if (!res.text?.trim()) {
      console.warn("⚠️ No text extracted — PDF may be image-only (needs OCR).");
      return { data: [], meta: { pages: res.numpages || 0 } };
    }

    if (options?.ai) {
      console.log("🤖 Using AI to structure extracted data...");
      const aiData = await extractJsonFromText(res.text);
      return { data: aiData, meta: { pages: res.numpages } };
    }

    // fallback if no AI
    return { data: [{ rawText: res.text }], meta: { pages: res.numpages } };
  },
};
