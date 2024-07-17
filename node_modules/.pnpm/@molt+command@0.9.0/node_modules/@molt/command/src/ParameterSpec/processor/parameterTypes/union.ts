import type { Settings } from '../../../index.js'
import type { Input } from '../../input.js'
import type { Output } from '../../output.js'
import type { ArgumentValueScalar } from '../../types.js'
import { getUnionScalar } from '../../types.js'
import { processEnvironment } from '../helpers/environment.js'
import { processName } from '../helpers/name.js'
import { analyzeZodTypeScalar } from '../helpers/zod.js'
import { z } from 'zod'

export const processUnion = (
  nameExpression: string,
  input: Input.Union,
  settings: Settings.Output,
): Output.Union => {
  const name = processName(nameExpression)
  const environment = processEnvironment(settings, name)
  const typeAnalysis = analyzeType(input)
  const parameter: Output.Union = {
    _tag: `Union`,
    name,
    environment,
    description: typeAnalysis.description,
    optionality: typeAnalysis.optionality,
    types: typeAnalysis.types,
  }
  return parameter
}

const analyzeType = (input: Input.Union) => {
  const isOptional = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional
  const hasDefault = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault
  // console.log(input.type, hasDefault)
  // @ts-expect-error todo
  // eslint-disable-next-line
  const defaultGetter = hasDefault ? (input.type._def.defaultValue as DefaultGetter) : null
  const union = getUnionScalar(input.type)
  const description = union.description ?? null
  const types = union._def.options.map((_) => {
    const typeAnalysis = analyzeZodTypeScalar(_)
    return {
      zodType: _,
      description: typeAnalysis.description,
      type: typeAnalysis.type,
    }
  })
  const optionality = (
    defaultGetter
      ? { _tag: `default`, getValue: () => defaultGetter() }
      : isOptional
      ? { _tag: `optional` }
      : { _tag: `required` }
  ) satisfies Output.Union['optionality']

  return {
    optionality,
    description,
    types,
  }
}

type DefaultGetter = () => ArgumentValueScalar
