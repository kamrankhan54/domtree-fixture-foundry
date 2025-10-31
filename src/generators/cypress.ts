import fs from "fs/promises";
import path from "path";

export async function generateCypress(data: any[], cfg: any) {
  const dir = path.join(cfg.outputDir, "cypress", "fixtures");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${cfg.datasetName}.json`), JSON.stringify(data, null, 2));
}
