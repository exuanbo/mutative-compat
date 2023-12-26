// @ts-check
/** @typedef {import('ts-jest').JestConfigWithTsJest} JestConfig */

/** @type {JestConfig} */
const config = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["unused"],
  preset: "ts-jest/presets/js-with-ts",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}

module.exports = config
