# 🧩 Domtree Fixture Foundry  
**Generate clean, consistent, and test-ready data fixtures — faster, smarter, and with quality intact.**

---

## 🚀 Overview

**Domtree Fixture Foundry** is a lightweight CLI that transforms real data (CSV or JSON) into normalized, ready-to-use fixtures for **Cypress**, **Playwright**, or raw JSON tests.

It combines **automation efficiency** with **human control** — letting you move faster without compromising quality or understanding.

> _Built in Node.js + TypeScript — with AI-ready schema inference and deterministic masking._

---

## ✨ Features

- 📄 **CSV / JSON ingestion** — auto-detects and parses input data  
- 🧠 **Schema inference** — detects types (boolean, int, float, date, email, enum)  
- 🧩 **Test-ready output** — generates fixtures for Cypress, Playwright, or generic JSON  
- 🔒 **Deterministic masking** — safely hides PII while keeping data consistent  
- ⚙️ **Field normalization** — converts headers to `camelCase`, removes BOM artifacts  
- 🧱 **Configurable rules** — customize mappings, enrich missing data, mask fields  
- ⚡ **Repeatable builds** — stable data generation across CI and local runs  

---

## 📦 Installation

```bash
# with npm
npm install -D @domtree/fixture-foundry

# or via npx (no install)
npx @domtree/fixture-foundry generate
