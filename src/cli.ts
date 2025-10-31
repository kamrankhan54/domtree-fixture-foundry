#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { run } from "./utils";

yargs(hideBin(process.argv))
  .scriptName("domtree-fixtures")
  .command(
    "generate",
    "Generate fixtures from config",
    (y: any) => y.option("config", { type: "string", default: "domtree.config.json" }),
    async (argv: any) => run(argv.config as string)
  )
  .demandCommand()
  .help()
  .parse();
