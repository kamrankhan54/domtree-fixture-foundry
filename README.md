# 🧩 Domtree Fixture Foundry

Generate clean, consistent, and test-ready data fixtures — faster, smarter, and with quality intact.

![npm](https://img.shields.io/npm/dt/domtree-fixture-foundry)

---

## 🚀 Overview

**Domtree Fixture Foundry** is a lightweight CLI that transforms real data into normalised, ready-to-use fixtures for **Cypress**, **Playwright**, or raw **JSON** tests.

It now also includes **AI-powered extraction** for unstructured documents — letting you convert PDFs and Word files into structured JSON automatically.

> **Human insight. AI precision. Build quality test data faster, with real product understanding.**

---

## ✨ Features

- 📄 **CSV / JSON ingestion** — reads and cleans raw structured data  
- 🧠 **AI document extraction (PDF / DOCX)** — turns reports or specs into JSON  
- ⚙️ **Schema inference** — detects numeric, boolean, date, email, and enum types  
- 🔒 **Deterministic masking** — hides PII while keeping data stable  
- 🧩 **Test-ready output** — generates fixtures for Cypress, Playwright, or raw JSON  
- 🧱 **Configurable rules** — custom mappings, enrichment, and masking  
- ⚡ **Repeatable builds** — deterministic for stable CI runs  

---

## ⚡ Quickstart

### 1️⃣ Install

```bash
npm i -D domtree-fixture-foundry
```

2️⃣ Create Your Input Data

You can start with a CSV, JSON, PDF, or DOCX file.

Example CSV
```bash
mkdir -p data
curl -L -o data/users.csv https://raw.githubusercontent.com/datablist/sample-csv-files/main/files/people/people-100.csv
```

Example PDF (test.pdf)

A table of companies like:

| Company | Contact    | Telephone no | Address      | Status |
| ------- | ---------- | ------------ | ------------ | ------ |
| Abc1    | John Smith | 01223232332  | 23 Test Road | Live   |
| Abc2    | Dan James  | 12128176287  | 24 Test Road | Live   |

3️⃣ Create a Config File

Create a file named domtree.config.json in your project root:
```bash
{
  "input": "data/users.json",
  "frameworks": ["cypress", "playwright", "raw"],
  "outputDir": "dist",
  "datasetName": "users",
  "mask": ["email", "phone"]
}
```
Key	Description
input	Path to your source data (CSV, JSON, PDF, DOCX)
frameworks	Output fixture formats
outputDir	Folder for generated fixtures
datasetName	Base name for files
mask	Fields to anonymise deterministically

💡 You can add optional keys like infer, mappings, or enrich for custom data rules.

🧠 AI-Powered Document Extraction

Use AI to extract structured data from unstructured documents (PDF or DOCX).
The model automatically identifies tables, fields, and relationships, returning clean JSON.

Uses OpenAI GPT-4o-mini for efficient, accurate extraction.

📄 Example: PDF Extraction

Input: data/test.pdf (a table of companies)

Run:
```bash
npx domtree-fixtures extract --input data/test.pdf --output data/test.json --ai
```

Output:
```bash
[
  {
    "company": "Abc1",
    "contact": "John Smith",
    "telephone": "01223232332",
    "address": "23 Test Road",
    "status": "Live"
  },
  {
    "company": "Abc2",
    "contact": "Dan James",
    "telephone": "12128176287",
    "address": "24 Test Road",
    "status": "Live"
  }
]
```

✅ AI reads the PDF, recognises headers, and structures the table automatically.

📝 Example: DOCX Extraction

Input: data/companies.docx (table or structured text)

Run:
```bash
npx domtree-fixtures extract --input data/companies.docx --output data/companies.json --ai
```

Output:
```bash
[
  {
    "company": "Abc1",
    "contact": "John Smith",
    "telephone": "01223232332",
    "address": "23 Test Road",
    "status": "Live"
  },
  {
    "company": "Abc2",
    "contact": "Dan James",
    "telephone": "12128176287",
    "address": "24 Test Road",
    "status": "Live"
  }
]
```

✅ Works for both Word tables and paragraph key/value structures.
AI automatically infers headers and returns consistent JSON objects.

🔧 Without AI (Basic Extraction)

If you don’t include --ai, the tool will still attempt a simple text or table parse using built-in logic.

Example:
```bash
npx domtree-fixtures extract --input data/test.pdf --output data/test_raw.json
```

Output:
```bash
[
  { "rawText": "Company Contact Telephone no Address Status ..." }
]
```

⚙️ Full Fixture Generation Example

Once you have clean JSON (either from CSV, DOCX, or PDF):
```bash
npx domtree-fixtures generate --config domtree.config.json
```

Results:
```bash
dist/
├─ cypress/fixtures/users.json
├─ tests/fixtures/users.ts
└─ users.json
```

🧩 Environment Setup for AI
```bash
Create a .env file in your project root:

OPENAI_API_KEY=sk-...
```

Ensure this is not committed to Git by adding .env to your .gitignore.

🧠 How It Works

Reads your input file (CSV, JSON, DOCX, or PDF)

Extracts or generates structured JSON

Infers schema and masks sensitive data

Outputs normalised fixtures for your testing frameworks

The combination of automation efficiency + AI product insight means you move faster — without losing quality.

🪜 Example End-to-End Flow

1️⃣ Add your data in data/
2️⃣ Create domtree.config.json
3️⃣ (Optional) Add .env with your OpenAI key
4️⃣ Run extraction:
```bash
npx domtree-fixtures extract --input data/test.pdf --output data/test.json --ai
```

5️⃣ Generate fixtures:
```bash
npx domtree-fixtures generate --config domtree.config.json
```

6️⃣ Use them in Cypress / Playwright tests.

💬 Output Example (Cypress)

cypress/fixtures/users.json
```bash
[
  { "name": "Jane Doe", "email": "masked_email@example.com", "age": 28 }
]
```

🧱 Roadmap

| Phase | Focus                                           | Status         |
| ----- | ----------------------------------------------- | -------------- |
| 1     | CSV/JSON schema inference + fixture generation  | ✅ Done         |
| 2     | AI-powered extraction for PDF & DOCX            | ✅ Done         |
| 3     | OCR for scanned PDFs (Tesseract.js)             | 🚧 In progress |
| 4     | Cloud API for bulk extraction + team dashboards | 🔜 Planned     |