import type { z } from 'zod'

export const inspect = (value: unknown) => {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/**
 * @see https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type?noredirect=1&lq=1
 */
// eslint-disable-next-line
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

export type AssertString<T> = T extends string ? T : never

export type ObjectValues<T> = T[keyof T]
/**
 * Is the data type schema empty? Empty means it has no properties beyond the standard `_tag` property.
 */
export const isEmptySchema = (schema: z.SomeZodObject) => {
  return Object.keys(schema._def.shape()).filter((key) => key !== `_tag`).length > 0
}

export const tryOrNull = <T extends unknown>(fn: () => T): T | null => {
  try {
    return fn()
  } catch {
    return null
  }
}

export type Rest<x extends unknown[]> = x extends [infer _first, ...infer rest] ? rest : []

export type IndexKeys<A extends readonly unknown[]> = Exclude<keyof A, keyof []>

export type OnlyStrings<x extends unknown> = x extends string ? x : never

export type OmitRequired<T extends unknown> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type IsUnknown<T extends unknown> = IsEqual<T, unknown>

export type IsEqual<T extends unknown, U extends unknown> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TupleToObject<T extends [string, any]> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in T[0]]: Extract<T, [key, any]>[1]
}

export type CreateObject<key extends string, Value> = {
  [k in key]: Value
}

export const isEmpty = (value: unknown[] | object) => {
  if (Array.isArray(value)) value.length === 0
  return Object.keys(value).length === 0
}

export const ensurePeriod = (s: string) => (s.length > 0 ? (s[s.length - 1] === `.` ? s : s + `.`) : s)

export const code = (s: string) => `\`${s}\``

/**
 * Cast the value to `any`
 */
// eslint-disable-next-line
export const asAny = (x: any): any => x

/**
 * Extend a chaining API with new methods.
 */
export const extendChain = (params: {
  chain: {
    terminus: string
    methods: Record<string, (...args: unknown[]) => unknown>
  }
  extensions: object
}) => {
  const wrapperChain = {
    _: {
      innerChain: params.chain.methods,
    },
    ...Object.fromEntries(
      Object.entries(params.chain.methods).map(([key, f]) => [
        key,
        key === params.chain.terminus
          ? f
          : (...args: unknown[]): unknown => {
              f(...args)
              return wrapperChain
            },
      ])
    ),
    ...params.extensions,
  }
  return wrapperChain
}

export const applyDefaults = (input: object, defaults: object) => {
  const input_ = { ...input }
  for (const entry of Object.entries(defaults)) {
    // @ts-expect-error dynamic
    // eslint-disable-next-line
    input_[entry[0]] = input_[entry[0]] === undefined ? entry[1] : input_[entry[0]]
  }
  return input_
}
