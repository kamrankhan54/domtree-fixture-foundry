import fs from "fs/promises";
import path from "path";
import { parseCsv } from "./ingest.js";
import { inferSchema } from "./infer.js";
import { normalizeRows } from "./normalise.js";
import { generateCypress } from "./generators/cypress.js";
import { generatePlaywright } from "./generators/playwright.js";
import { generateRaw } from "./generators/raw.js";

export async function run(configPath: string) {
  const cfg = JSON.parse(await fs.readFile(configPath, "utf-8"));
  const inputExt = path.extname(cfg.input).toLowerCase();
  let rows: any[];

  if (inputExt === ".csv") rows = await parseCsv(cfg.input);
  else if (inputExt === ".json") rows = JSON.parse(await fs.readFile(cfg.input, "utf-8"));
  else throw new Error("Unsupported input. Use CSV or JSON.");

  const schema = inferSchema(rows, cfg.infer?.sampleRows || 500, cfg.mappings || {});
  const normalized = normalizeRows(rows, schema, cfg);

  await fs.mkdir(cfg.outputDir, { recursive: true });

  for (const fw of cfg.frameworks as string[]) {
    if (fw === "cypress") await generateCypress(normalized, cfg);
    if (fw === "playwright") await generatePlaywright(normalized, cfg);
    if (fw === "raw") await generateRaw(normalized, cfg);
  }

  console.log(`✅ Fixtures generated in ${cfg.outputDir}`);
}
