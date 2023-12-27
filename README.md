# mutative-compat

[![npm](https://img.shields.io/npm/v/mutative-compat.svg)](https://www.npmjs.com/package/mutative-compat)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/mutative-compat.svg?label=bundle%20size)](https://bundlephobia.com/package/mutative-compat)
[![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/exuanbo/mutative-compat/test.yml.svg?branch=main)](https://github.com/exuanbo/mutative-compat/actions)
[![Codecov branch](https://img.shields.io/codecov/c/gh/exuanbo/mutative-compat/main.svg?token=aVkGJHj7Pg)](https://app.codecov.io/gh/exuanbo/mutative-compat)

[`Mutative`](https://github.com/unadlib/mutative) wrapper with full [`Immer`](https://github.com/immerjs/immer) API compatibility.

## Installation

```sh
# npm
npm install mutative-compat mutative

# Yarn
yarn add mutative-compat mutative
```

~~Optional but useful 😈:~~

```json5
// package.json
{
  "dependencies": {
    "immer": "npm:mutative-compat@^0.1.x",
    "mutative": "^1.0.2",
  },
  // npm
  "overrides": {
    "immer": "npm:mutative-compat@^0.1.x"
  },
  // Yarn
  "resolutions": {
    "immer": "npm:mutative-compat@^0.1.x"
  },
  // pnpm
  "pnpm": {
    "overrides": {
      "immer": "npm:mutative-compat@^0.1.x"
    }
  }
}
```

This way you can replace `immer` with `mutative` in some opinionated libraries like `redux-toolkit`.

## Differences from `Immer`

- The `freeze()` function will only freeze shallowly, the second argument `deep?: boolean` is omitted.
- In nested `produce()` calls, the inner results will never be frozen even if they're not used in the outer recipe.

For other minor differences ~~(you probably will never notice them)~~, see [mutative/test/immer-non-support.test.ts](https://github.com/unadlib/mutative/blob/main/test/immer-non-support.test.ts)

## License

[MIT License](https://github.com/exuanbo/mutative-compat/blob/main/LICENSE) @ 2023-Present [Xuanbo Cheng](https://github.com/exuanbo)
