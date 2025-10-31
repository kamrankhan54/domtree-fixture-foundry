const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const boolRe = /^(true|false|yes|no|0|1)$/i;

export type FieldType = "string"|"boolean"|"int"|"float"|"date"|"email"|"enum";
export type Schema = Record<string, { type: FieldType, enumValues?: string[] }>;

export function inferSchema(rows: any[], sampleRows: number, mappings: any): Schema {
  const sample = rows.slice(0, sampleRows);
  const fields = Object.keys(sample[0] || {});
  const schema: Schema = {};

  for (const f of fields) {
    if (mappings[f]?.type) { schema[f] = { type: mappings[f].type }; continue; }
    const values = sample.map(r => (r[f] ?? "").toString().trim()).filter(v => v !== "");
    const uniques = Array.from(new Set(values));
    let type: FieldType = "string";

    if (values.every(v => boolRe.test(v))) type = "boolean";
    else if (values.every(v => !isNaN(Number(v)) && Number.isInteger(Number(v)))) type = "int";
    else if (values.every(v => !isNaN(Number(v)))) type = "float";
    else if (values.every(v => !isNaN(Date.parse(v)))) type = "date";
    else if (values.every(v => emailRe.test(v))) type = "email";
    else if (uniques.length > 0 && uniques.length <= 10) type = "enum";

    schema[f] = (type === "enum") ? { type, enumValues: uniques } : { type };
  }
  return schema;
}
