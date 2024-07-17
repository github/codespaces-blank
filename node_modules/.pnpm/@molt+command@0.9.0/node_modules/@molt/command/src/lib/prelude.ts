export const isPromiseLikeValue = (value: unknown): value is Promise<unknown> => {
  return (
    typeof value === `object` &&
    value !== null &&
    `then` in value &&
    typeof value.then === `function` &&
    `catch` in value &&
    typeof value.catch === `function` &&
    `finally` in value &&
    typeof value.finally === `function`
  )
}

export type Index<T> = Record<string, T>

export type RequireField<O extends object, F extends keyof O> = O & {
  [key in F]: Exclude<O[F], undefined | null>
}

import { inspect } from 'node:util'

export const errorFromUnknown = (x: unknown): Error => {
  if (x instanceof Error) return x
  return new Error(String(x))
}

export const dump = (...args: unknown[]) =>
  console.log(...args.map((arg) => inspect(arg, { depth: Infinity, colors: true })))

type Include<T, U> = T extends U ? T : never

export const partition = <Item>(list: Item[], partitioner: (item: Item) => boolean): [Item[], Item[]] => {
  const left: Item[] = []
  const right: Item[] = []
  for (const item of list) {
    if (partitioner(item)) {
      right.push(item)
    } else {
      left.push(item)
    }
  }
  return [left, right]
}

// prettier-ignore
export function groupBy<Item extends object, Key extends string>(items: Item[], keyer: (item: Item) => Key): string extends Key ? Record<string,Item[]> : { [k in Key]?: Item[] }
// prettier-ignore
export function groupBy<Item extends object, Key extends keyof Item>(items: Item[], key: Key): { [k in Item[Key] & string]?: Include<Item, { [_ in Key]: k }>[] }
// prettier-ignore
//eslint-disable-next-line
export function groupBy<Item extends object, Key extends keyof Item>(items: Item[], key: Key | ((item: Item) => string)): { [k in Item[Key] & string]?: Item[] } {
  const result: Record<string, Item[]> = {}

  for (const item of items) {
    const keyValue = typeof key === `function`? key(item) : item[key]
    if (typeof keyValue !== `string`) {
      const message = typeof key === `function` ? `Invalid key type returned from keyer function: ${typeof keyValue}` : `Invalid key type: ${typeof keyValue}`
      throw Error(message)
    }
    if (!Array.isArray(result[keyValue])) result[keyValue] = []
    result[keyValue]! .push( item) // eslint-disable-line
  }

  // eslint-disable-next-line
  return result as any // eslint-disable-line
}

export type RenameKey<Obj, Old extends keyof Obj, New extends string> = {
  [Key in keyof Obj as Key extends Old ? New : Key]: Obj[Key]
}
