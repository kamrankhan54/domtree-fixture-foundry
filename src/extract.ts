import fs from "fs/promises";
import path from "path";
import { csvAdapter } from "./adapters/csv.adapter";
import { xlsxAdapter } from "./adapters/xlsx.adapter";
import { pdfAdapter } from "./adapters/pdf.adapter";
import { docxAdapter } from "./adapters/docx.adapter";
import { textAdapter } from "./adapters/text.adapter";
// (also import your existing csv/json adapters if you want them usable via extract)
import type { Adapter, ParsedData } from "./types";
import { aiStructure } from "./extract_ai";

const adapters: Adapter[] = [xlsxAdapter, pdfAdapter, docxAdapter, textAdapter, csvAdapter /* csvAdapter, jsonAdapter */];

export async function extract(opts: { input: string, output: string, ai?: boolean, sheet?: string | number }) {
  const adapter = adapters.find(a => a.canRead(opts.input));
  if (!adapter) throw new Error(`No adapter found for ${path.extname(opts.input)}.`);

  const parsed: ParsedData = await adapter.read(opts.input, { sheet: opts.sheet });

  let data = parsed.data;

  // Optional AI structuring pass for unstructured outputs
  if (opts.ai) {
    data = await aiStructure(data);
  }

  // Write normalized JSON ready for your generate pipeline
  await fs.mkdir(path.dirname(opts.output), { recursive: true });
  await fs.writeFile(opts.output, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Extracted ${data.length} record(s) → ${opts.output}`);
}
