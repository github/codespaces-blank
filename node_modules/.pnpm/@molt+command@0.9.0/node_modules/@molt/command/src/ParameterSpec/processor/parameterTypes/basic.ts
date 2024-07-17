import type { Settings } from '../../../index.js'
import type { Input } from '../../input.js'
import type { Output } from '../../output.js'
import type { ArgumentValueScalar } from '../../types.js'
import { processEnvironment } from '../helpers/environment.js'
import { processName } from '../helpers/name.js'
import { analyzeZodTypeScalar } from '../helpers/zod.js'
import { z } from 'zod'

export const processBasic = (
  expression: string,
  input: Input.Basic,
  settings: Settings.Output,
): Output.Basic => {
  const name = processName(expression)
  const environment = processEnvironment(settings, name)
  const typeAnalysis = analyzeZodType(input)
  const parameter = {
    _tag: `Basic`,
    description: typeAnalysis.description,
    type: typeAnalysis.type,
    optionality: typeAnalysis.optionality,
    prompt: {
      enabled:
        input.prompt === true
          ? true
          : input.prompt === false
          ? false
          : input.prompt === null
          ? null
          : input.prompt.enabled ?? null,
      when:
        input.prompt === null ? null : typeof input.prompt === `object` ? input.prompt.when ?? null : null,
    },
    environment,
    name,
  } satisfies Output.Basic

  return parameter
}

export const analyzeZodType = (input: Input.Basic) => {
  const isOptional = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional
  const hasDefault = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault
  // @ts-expect-error todo
  // eslint-disable-next-line
  const defaultGetter = hasDefault ? (input.type._def.defaultValue as DefaultGetter) : null
  const { description, type } = analyzeZodTypeScalar(input.type)
  const optionality = (
    defaultGetter
      ? { _tag: `default`, getValue: () => defaultGetter() }
      : isOptional
      ? { _tag: `optional` }
      : { _tag: `required` }
  ) satisfies Output.Basic['optionality']

  return {
    optionality,
    description,
    type,
  }
}

type DefaultGetter = () => ArgumentValueScalar
