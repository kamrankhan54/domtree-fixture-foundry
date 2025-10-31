import crypto from "crypto";
import type { Schema } from "./infer.js";

function mask(value: string) {
  // deterministic mask: stable hash keeps tests repeatable
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 10) + "@masked.test";
}

export function normalizeRows(rows: any[], schema: Schema, cfg: any) {
  const maskSet = new Set<string>(cfg.mask || []);
  return rows.map((r, idx) => {
    const out: any = {};
    for (const f of Object.keys(schema)) {
      let v = r[f];
      if (v === "" || v == null) {
        if (cfg.enrich?.fillMissingStrings === "fixed-fake") v = `missing_${f}_${idx}`;
        else if (typeof cfg.enrich?.fillMissingNumbers === "number") v = cfg.enrich.fillMissingNumbers;
      }
      if (maskSet.has(f) && typeof v === "string" && v.includes("@")) v = mask(v);
      out[f] = cast(v, schema[f].type);
    }
    return out;
  });
}

function cast(v: any, t: string) {
  if (v == null) return v;
  if (t === "boolean") return /^(true|yes|1)$/i.test(String(v));
  if (t === "int") return parseInt(v, 10);
  if (t === "float") return parseFloat(v);
  if (t === "date") return new Date(v).toISOString();
  return v;
}
