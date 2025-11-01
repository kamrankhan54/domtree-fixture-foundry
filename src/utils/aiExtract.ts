import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractJsonFromText(rawText: string): Promise<any> {
  const prompt = `
You are a data-extraction AI. The user will provide text extracted from a document.
Return only valid JSON — an array of objects with camelCased keys that capture the structure of the data.

Text:
"""
${rawText}
"""
`;

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    // ---- handle all SDK shapes safely ----
    let outputText = "";

    if (Array.isArray(response.output)) {
      const first: any = response.output[0]; // 👈 cast to any to silence type errors
      const content = (first as any).content;

      if (Array.isArray(content)) {
        const textBlock = content.find((c: any) => c.type === "output_text");
        outputText = textBlock?.text?.trim() ?? "";
      } else if (Array.isArray(first?.content)) {
        // fallback pattern for chat-like responses
        outputText = first.content.map((c: any) => c.text || "").join(" ").trim();
      }
    }

    if (!outputText && (response as any).output_text) {
      outputText = (response as any).output_text;
    }

    // ---- extract JSON safely ----
    const jsonStart = outputText.indexOf("[");
    const jsonEnd = outputText.lastIndexOf("]");
    const jsonString = outputText.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ AI extraction failed:", err);
    return [{ rawText }];
  }
}
