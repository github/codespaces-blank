/*

Terminology:

- Match Builder
- Matcher
  - Tag Matcher
  - Data Matcher
- Pattern
  - Tag
  - Data
- Handler
 */

import type { OmitWithTag2 } from './core/types.js'
import { inspect } from './lib/utils.js'
import type { GetTag, GetTagProperty, SomeRecord, SomeTaggedRecord } from './record/types/controller.js'
import { getTag } from './record/types/controller.js'
import isMatch from 'lodash.ismatch'
export type SomeTag = string

export type SomeMatchHandler = (data: string | object) => unknown

export interface TagMatcherDefinition {
  _tag: 'TagMatcherDefinition'
  tag: string
  handler: SomeMatchHandler
}

export interface DataMatcherDefinition {
  _tag: 'DataMatcherDefinition'
  tag: string
  dataPattern: object
  handler: SomeMatchHandler
}

// prettier-ignore
interface Match {
  <Tag extends SomeTag>(tag: Tag)                                                     : ChainTagPreMatcher<Tag, never>
  <AlgebraicDataType extends SomeTaggedRecord>(algebraicDataType: AlgebraicDataType)  : ChainPreMatcher<AlgebraicDataType, never>
}

type MatchArgs = [input: SomeTag | SomeTaggedRecord]

export const match: Match = (...args: MatchArgs) => {
  const input = args[0]
  const elseBranch: { defined: boolean; value: unknown | ((data: object) => unknown) } = {
    defined: false,
    value: undefined,
  }
  const matcherStack: (DataMatcherDefinition | TagMatcherDefinition)[] = []
  const tagMatchers: Record<string, TagMatcherDefinition> = {}

  const execute = () => {
    for (const matcher of matcherStack) {
      if (
        (typeof input === `string` && matcher.tag === input) ||
        (typeof input === `object` && matcher.tag === getTag(input))
      ) {
        if (matcher._tag === `DataMatcherDefinition`) {
          if (isMatch(input as SomeRecord, matcher.dataPattern)) {
            return matcher.handler(input as SomeRecord)
          }
        } else {
          return matcher.handler(input)
        }
      }
    }
    if (elseBranch.defined) {
      return typeof elseBranch.value === `function` ? (elseBranch.value(input) as unknown) : elseBranch.value
    }
    throw new Error(
      `No matcher matched on the given data. This should be impossible. Are you sure the runtime is not different than the static types? Please report a bug at https://jasonkuhrt/alge. The given data was:\n${inspect(
        input
      )}`
    )
  }

  const proxy = new Proxy(
    {},
    {
      get: (_target, property: string, _receiver) => {
        if (property === `else`) {
          if (matcherStack.length === 0) return undefined

          elseBranch.defined = true
          return (value: unknown) => {
            elseBranch.value = value
            return execute()
          }
        }
        if (property === `done`) {
          // done only when exhaustive, only exhaustive when every tag generally matched
          if (Object.keys(tagMatchers).length === 0) return undefined

          return execute
        }

        return (...args: [handler: SomeMatchHandler] | [dataPattern: object, handler: SomeMatchHandler]) => {
          const matcher =
            args.length === 1
              ? { _tag: `TagMatcherDefinition` as const, tag: property, handler: args[0] }
              : {
                  _tag: `DataMatcherDefinition` as const,
                  tag: property,
                  dataPattern: args[0],
                  handler: args[1],
                }

          if (tagMatchers[property]) {
            if (matcher._tag === `TagMatcherDefinition`) {
              throw new Error(`${property} has already been matched on.`)
            }
            throw new Error(
              `Cannot define this data matcher:\n${inspect(
                args[0]
              )}\nfor ${property} because it will never match because it comes after matching on ${property} generally.`
            )
          }

          matcherStack.push(matcher)

          if (matcher._tag === `TagMatcherDefinition`) {
            tagMatchers[property] = matcher
          }
          return proxy
        }
      },
    }
  )

  // eslint-disable-next-line
  return proxy as any
}

// prettier-ignore
type PickWithTag<Tag extends string, ADT extends SomeTaggedRecord> =
  ADT extends SomeTaggedRecord<Tag>
    ? ADT
    : never

//prettier-ignore
type ChainPreMatcher<ADT extends SomeTaggedRecord, Result> = {
  [Tag in GetTag<ADT>]:
     (<ThisResult extends unknown, Pattern extends Partial<OmitWithTag2<PickWithTag<Tag, ADT>>>>(dataPattern: Pattern, handler: (data: Pattern & PickWithTag<Tag, ADT>, test:Pattern) => ThisResult) => ChainPostMatcher<ADT, never, ThisResult | Result>) &
     (<ThisResult extends unknown>(handler: (data: PickWithTag<Tag, ADT>) => ThisResult) => ChainPostMatcher<ADT, Tag, ThisResult | Result>)
}

/**
 * 1. When an unqualified variant matcher has been defined then
 *    it should not be definable again in the chain since it would
 *    never be called at runtime
 */
//prettier-ignore
type ChainPostMatcher<ADT extends SomeTaggedRecord, TagsPreviouslyMatched extends string, Result> = {
  [Tag in Exclude<GetTag<ADT>, TagsPreviouslyMatched>]:
  (
    (<ThisResult extends unknown, Pattern extends Partial<OmitWithTag2<PickWithTag<Tag, ADT>>>>(dataPattern: Pattern, handler: (data: Pattern & PickWithTag<Tag, ADT>) => ThisResult) => ChainPostMatcher<ADT, TagsPreviouslyMatched, '__init__' extends Result ? ThisResult : ThisResult | Result>) &
    (<ThisResult extends unknown>(handler: (data: PickWithTag<Tag, ADT>) => ThisResult) => ChainPostMatcher<ADT, Tag|TagsPreviouslyMatched, ThisResult | Result>)
  )
  //      ^[1]                 ^[1]
} & (
  Exclude<GetTag<ADT>, TagsPreviouslyMatched> extends never ? {
    done: () => Result
  } : {
    else: <ThisResult extends unknown>(value: ThisResult | ((data: ExcludeByTag<ADT, TagsPreviouslyMatched>) => ThisResult)) => Result | ThisResult
  }
)

//prettier-ignore
type ChainTagPreMatcher<Tags extends SomeTag, Result> = {
  [ThisTag in Tags]:
     (<ThisResult extends unknown>(handler: () => ThisResult) => ChainTagPostMatcher<Tags, ThisTag, ThisResult | Result>)
}

//prettier-ignore
type ChainTagPostMatcher<Tags extends SomeTag, TagsPreviouslyMatched extends string, Result> =
{
  [ThisTag in Exclude<Tags, TagsPreviouslyMatched>]:
    (<ThisResult extends unknown>(handler: () => ThisResult) => ChainTagPostMatcher<Tags, ThisTag|TagsPreviouslyMatched, ThisResult | Result>)
}
& (
  Exclude<Tags, TagsPreviouslyMatched> extends never ? {
    done: () => Result
  } : {
    else: <ThisResult extends unknown>(value: ThisResult | ((data: Exclude<Tags, TagsPreviouslyMatched>) => ThisResult)) => Result | ThisResult
  }
)

// prettier-ignore
type ExcludeByTag<TaggedRecord extends SomeTaggedRecord, Tag extends string> =
  TaggedRecord extends { [k in GetTagProperty<TaggedRecord>]: Tag }
  ? never
  : TaggedRecord
