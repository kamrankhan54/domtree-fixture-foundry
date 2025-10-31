import fs from "fs/promises";
import path from "path";

export async function generateRaw(data: any[], cfg: any) {
  const dir = path.join(cfg.outputDir);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${cfg.datasetName}.json`), JSON.stringify(data, null, 2));
}
