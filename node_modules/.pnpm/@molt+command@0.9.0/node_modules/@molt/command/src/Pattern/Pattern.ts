import type { Simplify } from 'type-fest'

export const _ = `*`

export type SomeData = SomeDataObject | SomeDataScalar

type SomeDataObject = object

type SomeDataScalar = number | string | boolean | null

// prettier-ignore
export type Pattern<Data extends SomeData, DiscriminantProperty extends null|keyof Data = null> =
	Or<
		Data extends SomeDataScalar ? Data :
			                            PatternForObject<Exclude<Data, SomeDataScalar>, DiscriminantProperty>
>

export type PatternForValue<Data extends SomeData> = Data extends SomeDataScalar
  ? Data
  : PatternForObject<Exclude<Data, SomeDataScalar>>

// prettier-ignore
export type PatternForObject<Data extends SomeDataObject, DiscriminantProperty extends null|keyof Data = null> = {
		[K in Exclude<keyof Data, DiscriminantProperty>]?:Simplify<
			Data[K] extends Array<any>     ? Or<PatternForValue<Data[K][number]>[]> :
			Data[K] extends SomeDataObject ? Or<PatternForObject<Data[K]>> :
				                               Or<Data[K]>>
	} & (
    null extends DiscriminantProperty ? {} // eslint-disable-line
                                      : { [K in Exclude<DiscriminantProperty,null>]: Data[K] }
  )

type Or<T> = T | T[]

export const match = <D extends SomeData, P extends Pattern<D> | undefined>(data: D, pattern: P): boolean => {
  if (pattern === _) {
    return true
  }

  /**
   * If the _data_ is an array, then the OR _pattern_ must be lifted up on level
   */
  if (Array.isArray(data)) {
    if (!Array.isArray(pattern)) {
      throw new Error(`Invalid pattern for data.\nPattern: ${pattern?.toString()}\nData: ${data.toString()}`)
    }
    const isOrKindPattern = pattern.filter((_) => Array.isArray(_)).length === pattern.length
    if (isOrKindPattern) {
      return pattern.some((_) => match(data, _))
    }
    // Singular Kind Pattern
    if (pattern.length !== data.length) {
      // If we don't have same-length arrays then we know it's not a match.
      return false
    }
    // Although we only iterate the data members we know its length is the same as the pattern.
    const isAllMembersMatch = data.filter((_, i) => match(_, pattern[i])).length === data.length
    return isAllMembersMatch
  }

  if (Array.isArray(pattern)) {
    return pattern.some((_) => match(data, _))
  }

  const patternType = typeof pattern

  if (patternType === `undefined` || patternType === `function`) {
    return false
  }

  if (typeof pattern === `object` && pattern !== null) {
    if (!(typeof data === `object` && data !== null)) {
      return false
    }
    const valuePatterns = Object.entries(pattern)
    if (valuePatterns.length === 0) {
      return true
    }
    return valuePatterns
      .map(([key, valuePattern]) => {
        if (!(key in data)) {
          return false
        }
        // eslint-disable-next-line
        return match((data as any)[key], valuePattern)
      })
      .reduce((all, next) => all && next, true)
  }

  return pattern === (data as boolean)
}
