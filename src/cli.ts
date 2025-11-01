#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { run } from "./utils";
import { run as runGenerate } from "./utils";
import { extract } from "./extract";

yargs(hideBin(process.argv))
  .scriptName("domtree-fixtures")
  .command(
    "generate",
    "Generate fixtures from config",
    (y: any) => y.option("config", { type: "string", default: "domtree.config.json" }),
    async (argv: any) => runGenerate(argv.config as string)
  )
  .command(
    "extract",
    "Extract structured JSON from documents (xlsx, pdf, docx, txt)",
    y => y
      .option("input", { type: "string", demandOption: true })
      .option("output", { type: "string", demandOption: true })
      .option("ai", { type: "boolean", default: false, describe: "Use AI to structure data" }),
    async argv => {
      await extract({
        input: argv.input,
        output: argv.output,
        ai: argv.ai,
      });
    }
  )
  .demandCommand()
  .help()
  .parse();
