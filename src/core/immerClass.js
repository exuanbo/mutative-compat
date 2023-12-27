import { apply, create, isDraft, rawReturn } from "mutative"

import { DRAFTABLE, NOTHING } from "../internal"

const objectCtorString = Object.prototype.constructor.toString()

export class Immer {
  static _nestedDepth = -1

  _autoFreeze
  _useStrictShallowCopy

  constructor({ autoFreeze = true, useStrictShallowCopy = false } = {}) {
    this._autoFreeze = autoFreeze
    this._useStrictShallowCopy = useStrictShallowCopy
  }

  setAutoFreeze(value) {
    this._autoFreeze = value
  }

  setUseStrictShallowCopy(value) {
    this._useStrictShallowCopy = value
  }

  get _options() {
    const autoFreeze = !Immer._nestedDepth && this._autoFreeze
    const useStrictShallowCopy = this._useStrictShallowCopy
    return {
      enableAutoFreeze: autoFreeze,
      mark: (target, { immutable: IMMUTABLE }) => {
        if (!target || typeof target !== "object") {
          return
        }
        if (target[DRAFTABLE]) {
          return IMMUTABLE
        }
        const proto = Object.getPrototypeOf(target)
        if (proto === null) {
          return IMMUTABLE
        }
        const Ctor =
          Object.prototype.hasOwnProperty.call(proto, "constructor") &&
          proto.constructor
        if (typeof Ctor !== "function") {
          return
        }
        if (Ctor[DRAFTABLE]) {
          return IMMUTABLE
        }
        if (!useStrictShallowCopy) {
          return
        }
        if (
          Ctor === Object ||
          Function.prototype.toString.call(Ctor) === objectCtorString
        ) {
          return IMMUTABLE
        }
      },
    }
  }

  _curryProduce(defaultBase, recipe, producer) {
    return function curriedProduce(base = defaultBase, ...args) {
      return producer(base, (draft) => recipe.call(this, draft, ...args))
    }
  }

  produce = (base, recipe, patchListener) => {
    if (typeof base === "function" && typeof recipe !== "function") {
      return this._curryProduce(recipe, base, this.produce)
    }
    Immer._nestedDepth++
    try {
      const mutate = withResultProcessor(recipe)
      if (patchListener) {
        const [result, patches, inversePatches] = create(base, mutate, {
          ...this._options,
          enablePatches: true,
        })
        patchListener(patches, inversePatches)
        return result
      }
      return create(base, mutate, this._options)
    } finally {
      Immer._nestedDepth--
    }
  }

  produceWithPatches = (base, recipe) => {
    if (typeof base === "function" && typeof recipe !== "function") {
      return this._curryProduce(recipe, base, this.produceWithPatches)
    }
    Immer._nestedDepth++
    try {
      const mutate = withResultProcessor(recipe)
      return create(base, mutate, {
        ...this._options,
        enablePatches: true,
      })
    } finally {
      Immer._nestedDepth--
    }
  }

  static _finalizers = new WeakMap()

  createDraft(state) {
    const [draft, finalize] = create(state, {
      ...this._options,
      enablePatches: true,
    })
    Immer._finalizers.set(draft, finalize)
    return draft
  }

  finishDraft(draft, patchListener) {
    const finalize = Immer._finalizers.get(draft)
    if (!finalize) {
      throw new Error(
        "First argument to `finishDraft` must be a draft returned by `createDraft`",
      )
    }
    const [result, patches, inversePatches] = finalize()
    patchListener?.(patches, inversePatches)
    return result
  }

  applyPatches(base, patches) {
    if (isDraft(base)) {
      return apply(base, patches)
    }
    return apply(base, patches, this._options)
  }
}

function withResultProcessor(recipe) {
  return (...args) => {
    const result = recipe(...args)
    if (result === NOTHING) {
      return rawReturn(undefined)
    }
    return result
  }
}
