import fs from "node:fs/promises"

import { defineConfig, Options } from "tsup"

export default defineConfig((options) => {
  const commonOptions: Partial<Options> = {
    entry: {
      immer: "src/immer.js",
    },
    loader: {
      ".js": "ts",
    },
    platform: "neutral",
    sourcemap: true,
    ...options,
  }

  const productionOptions: Partial<Options> = {
    entry: {
      "immer.production": "src/immer.js",
    },
    minify: true,
    replaceNodeEnv: true,
  }

  return [
    {
      ...commonOptions,
      format: ["esm", "cjs"],
      dts: true,
    },
    {
      ...commonOptions,
      format: "esm",
      target: "es2017",
      legacyOutput: true,
    },
    {
      ...commonOptions,
      ...productionOptions,
      format: ["esm", "cjs"],
      async onSuccess() {
        await Promise.all([
          fs.copyFile(
            "node_modules/immer/dist/cjs/index.js.flow",
            "dist/index.js.flow",
          ),
          fs.writeFile(
            "dist/index.js",
            `"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./immer.production.js");
} else {
  module.exports = require("./immer.js");
}`,
          ),
        ])
      },
    },
  ]
})
