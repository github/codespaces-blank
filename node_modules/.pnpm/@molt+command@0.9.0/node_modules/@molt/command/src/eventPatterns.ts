import type { Errors } from './Errors/index.js'
import type { OpeningArgs } from './OpeningArgs/index.js'
import type { ParameterSpec } from './ParameterSpec/index.js'
import type { Pattern } from './Pattern/Pattern.js'
import type { z } from 'zod'

// prettier-ignore
export type EventPatternsInputAtLeastOne<Schema extends ParameterSpec.Input.Schema> =
  z.ZodFirstPartyTypeKind.ZodOptional extends Schema['_def']['typeName']  	? Pattern<BasicParameterParseEvent,'result'> :
  z.ZodFirstPartyTypeKind.ZodDefault  extends Schema['_def']['typeName']    ? Pattern<BasicParameterParseEvent,'result'> :
                                                                              Pattern<BasicParameterParseEventAccepted | BasicParameterParseEventRejected,'result'>

// prettier-ignore
export type EventPatternsInput<Schema extends ParameterSpec.Input.Schema> =
  Schema['_def']['typeName'] extends z.ZodFirstPartyTypeKind.ZodOptional  ? Pattern<BasicParameterParseEvent,'result'> :
  Schema['_def']['typeName'] extends z.ZodFirstPartyTypeKind.ZodDefault   ? Pattern<BasicParameterParseEvent,'result'> :
                                                                            Pattern<BasicParameterParseEventAccepted | BasicParameterParseEventRejected,'result'>

export type BasicParameterParseEvent =
  | BasicParameterParseEventAccepted
  | BasicParameterParseEventRejected
  | BasicParameterParseEventOmitted

export interface BasicParameterParseEventOmitted {
  result: 'omitted'
  spec: ParameterSpec.Output.BasicData
}

export interface BasicParameterParseEventAccepted {
  result: 'accepted'
  spec: ParameterSpec.Output.BasicData
  value: ParameterSpec.ArgumentValue
}

export interface BasicParameterParseEventRejected {
  result: 'rejected'
  spec: ParameterSpec.Output.BasicData
  error: Errors.ErrorMissingArgument['name'] | Errors.ErrorInvalidArgument['name']
}

export const createEvent = (parseResult: OpeningArgs.ParseResultBasic) => {
  const specData: ParameterSpec.Output.BasicData | ParameterSpec.Output.UnionData =
    parseResult.spec._tag === `Basic`
      ? {
          ...parseResult.spec,
          _tag: `BasicData` as const,
          optionality: parseResult.spec.optionality[`_tag`],
        }
      : {
          ...parseResult.spec,
          _tag: `UnionData` as const,
          optionality: parseResult.spec.optionality[`_tag`],
          types: parseResult.spec.types.map(({ zodType: _, ...rest }) => rest),
        }
  return parseResult._tag === `supplied`
    ? { result: `accepted`, spec: specData, value: parseResult.value }
    : parseResult._tag === `omitted`
    ? { result: `omitted`, spec: specData }
    : parseResult._tag === `error` &&
      parseResult.errors.length > 0 &&
      // If there are any other kinds of errors than the two named below then we do not, currently, support prompting for that case.
      parseResult.errors.filter(
        (_) => [`ErrorInvalidArgument`, `ErrorMissingArgument`].includes(_.name) === false,
      ).length === 0
    ? // It is not possible to have invalid argument and missing argument errors at once.
      {
        result: `rejected`,
        spec: specData,
        error: parseResult.errors[0]!.name as `ErrorInvalidArgument` | `ErrorMissingArgument`,
      }
    : null
}

export const eventPatterns = {
  always: {},
  omitted: {
    result: `omitted`,
  },
  omittedWithoutDefault: {
    result: `omitted`,
    spec: {
      optionality: `optional`,
    },
  },
  omittedWithDefault: {
    result: `omitted`,
    spec: {
      optionality: `default`,
    },
  },
  rejectedMissingOrInvalid: {
    result: `rejected`,
    error: [`ErrorInvalidArgument`, `ErrorMissingArgument`],
  },
} satisfies Record<string, Pattern<BasicParameterParseEvent>>
