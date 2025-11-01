import type { Adapter, ParsedData } from "../types";
import fs from "fs/promises";

export const textAdapter: Adapter = {
  canRead(file) {
    return /\.(txt|md)$/i.test(file);
  },
  async read(file): Promise<ParsedData> {
    const txt = await fs.readFile(file, "utf-8");
    return { data: [{ rawText: txt }], meta: {} };
  }
};
