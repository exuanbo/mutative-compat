export {
  original,
  current,
  isDraft,
  isDraftable,
  NOTHING as nothing,
  DRAFTABLE as immerable,
  freeze,
} from "./internal"

import { Immer } from "./core/immerClass"

const immer = /*#__PURE__*/ new Immer()

export const produce = immer.produce

export const produceWithPatches = immer.produceWithPatches

export const setAutoFreeze = immer.setAutoFreeze.bind(immer)

export const setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer)

export const applyPatches = immer.applyPatches.bind(immer)

export const createDraft = immer.createDraft.bind(immer)

export const finishDraft = immer.finishDraft.bind(immer)

export { castDraft, castImmutable } from "mutative"

export { Immer }

export function enablePatches() {}

export function enableMapSet() {}
