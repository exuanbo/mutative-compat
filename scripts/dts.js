const fs = require("node:fs")
const path = require("node:path")

process.chdir(path.join(__dirname, ".."))

fs.copyFileSync(
  path.join("node_modules", "immer", "dist", "immer.d.ts"),
  path.join("src", "immer.d.ts"),
)
