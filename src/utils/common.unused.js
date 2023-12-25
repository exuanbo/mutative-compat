import { DRAFT_STATE } from "./env.unused"

const getPrototypeOf = Object.getPrototypeOf

const objectCtorString = Object.prototype.constructor.toString()

export function isPlainObject(value) {
  if (!value || typeof value !== "object") return false
  const proto = getPrototypeOf(value)
  if (proto === null) {
    return true
  }
  const Ctor =
    Object.hasOwnProperty.call(proto, "constructor") && proto.constructor

  if (Ctor === Object) return true

  return (
    typeof Ctor == "function" &&
    Function.toString.call(Ctor) === objectCtorString
  )
}

export function each(target, iter) {
  const type = getArchtype(target)
  if (type === 0 /* DraftType.Object */) {
    Reflect.ownKeys(target).forEach((key) => {
      iter(key, target[key], target)
    })
  } else if (type === 1 /* DraftType.Array */) {
    let index = 0
    for (const entry of target) {
      iter(index, entry, target)
      index += 1
    }
  } else {
    target.forEach((entry, index) => iter(index, entry, target))
  }
}

export function getArchtype(target) {
  if (Array.isArray(target)) return 1 /* DraftType.Array */
  if (target instanceof Map) return 2 /* DraftType.Map */
  if (target instanceof Set) return 3 /* DraftType.Set */
  return 0 /* DraftType.Object */
}

function isMap(target) {
  return target instanceof Map
}

function isSet(target) {
  return target instanceof Set
}

export function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base)
  }
  if (isSet(base)) {
    return new Set(base)
  }
  if (Array.isArray(base)) return Array.prototype.slice.call(base)

  if (!strict && isPlainObject(base)) {
    if (!getPrototypeOf(base)) {
      const obj = Object.create(null)
      return Object.assign(obj, base)
    }
    return { ...base }
  }

  const descriptors = Object.getOwnPropertyDescriptors(base)
  delete descriptors[DRAFT_STATE]
  let keys = Reflect.ownKeys(descriptors)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const desc = descriptors[key]
    if (desc.writable === false) {
      desc.writable = true
      desc.configurable = true
    }
    // like object.assign, we will read any _own_, get/set accessors. This helps in dealing
    // with libraries that trap values, like mobx or vue
    // unlike object.assign, non-enumerables will be copied as well
    if (desc.get || desc.set)
      descriptors[key] = {
        configurable: true,
        writable: true, // could live with !!desc.set as well here...
        enumerable: desc.enumerable,
        value: base[key],
      }
  }
  return Object.create(getPrototypeOf(base), descriptors)
}
