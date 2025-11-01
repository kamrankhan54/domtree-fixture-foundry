import 'dotenv/config';
import { z } from "zod";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// generic schema: array of objects with string keys
const Row = z.record(z.string(), z.any());
const Rows = z.array(Row);

function looksUnstructured(row: any) {
  return !row || typeof row !== "object" || "rawText" in row || Object.keys(row).length < 2;
}

export async function aiStructure(rows: any[]): Promise<any[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not set; skipping AI structuring.");
    return rows;
  }

  const needAI = rows.length === 0 || rows.some(looksUnstructured);
  if (!needAI) return rows;

  const sample = rows.slice(0, 10);

  const system = `You are a data structuring assistant for software testing.
Your task: convert messy text into a uniform array of JSON objects with consistent, camelCased keys.
Return ONLY valid JSON (array of objects). Do not include comments or prose.`;

  const user = `Input examples (array):
${JSON.stringify(sample, null, 2)}

Goal:
- Extract meaningful fields (e.g., firstName, lastName, email, phone, createdAt, plan, isTrial).
- Use ISO 8601 for dates where possible.
- Booleans must be true/false.
- Numbers must be numbers.
- If only free text is present, attempt to extract named fields; otherwise return [{ rawText: "..."}] as a last resort.

Return strictly: JSON array of objects.`;

  const resp = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.2,
    max_output_tokens: 1500
  });

  const text = resp.output_text?.trim();
  if (!text) return rows;

  // attempt JSON parse safely
  try {
    const parsed = JSON.parse(text);
    const safe = Rows.parse(parsed);
    return safe;
  } catch (e) {
    console.warn("⚠️ AI structuring failed, using original rows.", e);
    return rows;
  }
}
