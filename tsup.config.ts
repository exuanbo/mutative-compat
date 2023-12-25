import fs from "node:fs/promises"

import { defineConfig, Options } from "tsup"

export default defineConfig((options) => {
  const commonOptions: Partial<Options> = {
    entry: ["src/immer.js"],
    sourcemap: true,
    ...options,
  }

  const productionOptions: Partial<Options> = {
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    minify: true,
  }

  return [
    // DTS only
    {
      ...commonOptions,
      dts: { only: true },
      format: ["esm", "cjs"],
    },
    // ESM, standard bundler dev, embedded `process` references
    {
      ...commonOptions,
      format: "esm",
      onSuccess() {
        return fs.copyFile(
          "node_modules/immer/src/types/index.js.flow",
          "dist/cjs/index.js.flow",
        )
      },
    },
    // ESM, Webpack 4 support. Target ES2018 syntax to compile away optional chaining and spreads
    {
      ...commonOptions,
      entry: {
        "immer.legacy-esm": "src/immer.js",
      },
      format: "esm",
      outExtension: () => ({ js: ".js" }),
      target: "es2017",
    },
    // ESM for use in browsers. Minified, with `process` compiled away
    {
      ...commonOptions,
      ...productionOptions,
      entry: {
        "immer.production": "src/immer.js",
      },
      format: "esm",
    },
    // CJS development
    {
      ...commonOptions,
      format: "cjs",
      outDir: "dist/cjs",
    },
    // CJS production
    {
      ...commonOptions,
      ...productionOptions,
      entry: {
        "immer.production": "src/immer.js",
      },
      format: "cjs",
      outDir: "dist/cjs",
      onSuccess() {
        return fs.writeFile(
          "dist/cjs/index.js",
          `'use strict'

if (process.env.NODE_ENV === "production") {
  module.exports = require("./immer.production.js")
} else {
  module.exports = require("./immer.js")
}`,
        )
      },
    },
  ] as const
})
