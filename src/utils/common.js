import { isDraft, isDraftable } from "mutative"

export { isDraft, isDraftable }

export { original } from "mutative"

export function freeze(obj, _deep = false) {
  if (Object.isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) {
    return obj
  }
  return Object.freeze(obj)
}
