# 🧩 Domtree Fixture Foundry

[![npm version](https://img.shields.io/npm/v/@domtree/fixture-foundry.svg)](https://www.npmjs.com/package/@domtree/fixture-foundry)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Node](https://img.shields.io/badge/node-%3E%3D18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)

**Generate clean, consistent, and test-ready data fixtures — faster, smarter, and with quality intact.**

---

## 🚀 Overview

**Domtree Fixture Foundry** is a lightweight CLI that transforms real data (CSV or JSON) into normalized, ready-to-use fixtures for **Cypress**, **Playwright**, or raw JSON tests.

It combines **automation efficiency** with **human insight** — letting teams move faster without compromising product understanding or quality.

> _Built in Node.js + TypeScript — with schema inference, deterministic masking, and AI-ready extension points._

---

## ✨ Features

- 📄 **CSV / JSON ingestion** — reads and cleans raw data  
- 🧠 **Schema inference** — detects boolean, numeric, date, email, enum types  
- 🧩 **Test-ready output** — generates fixtures for Cypress, Playwright, or generic JSON  
- 🔒 **Deterministic masking** — safely hides PII while keeping tests repeatable  
- ⚙️ **Header normalization** — trims, removes BOMs, and converts to `camelCase`  
- 🧱 **Configurable rules** — custom mappings, enrichment, and masking  
- ⚡ **Repeatable builds** — deterministic for stable CI runs  

---

## ⚡ Quickstart

```bash
# 1. Install
npm i -D domtree-fixture-foundry

# 2. Add a CSV (100 sample people)
mkdir -p data
curl -L -o data/users.csv https://raw.githubusercontent.com/datablist/sample-csv-files/main/files/people/people-100.csv

# 3. Create config
🧩 Create a Config File

Create a configuration file (e.g. domtree.config.json) in your project root.
This defines where your input data lives, which frameworks to output for, and where fixtures should be saved.
cat > domtree.config.json << 'JSON'
{
  "input": "data/<your-file>.csv",
  "frameworks": ["cypress", "playwright", "raw"],
  "outputDir": "dist",
  "datasetName": "<dataset-name>",
  "mask": ["email", "phone"]
}
JSON

Example:

input: path to your source data (CSV or JSON)
frameworks: fixture formats to generate
outputDir: where to place generated fixtures
datasetName: base name for output files
mask: fields to anonymize deterministically

💡 You can also add optional keys like infer, mappings, or enrich for more control.

# 4. Generate
npx domtree-fixtures generate --config domtree.config.json

✅ Output:

dist/
 ├─ cypress/fixtures/users.json
 ├─ tests/fixtures/users.ts
 └─ users.json

🪜 Step-by-Step Example
1️⃣ Create a sample CSV or any other file format with data

2️⃣ Create domtree.config.json

{
  "input": "data/users.csv",
  "frameworks": ["cypress", "playwright", "raw"],
  "outputDir": "dist",
  "datasetName": "users"
}

3️⃣ Generate fixtures

npx domtree-fixtures generate --config domtree.config.json

✅ You’ll see:

✅ Fixtures generated in dist

🧠 How It Works

Ingests CSV or JSON

Infers schema (booleans, numbers, dates, etc.)

Normalizes headers, masks sensitive fields, fills missing data

Generates test-ready fixture files

Deterministic + repeatable = high-quality test data that behaves the same in local and CI environments.
