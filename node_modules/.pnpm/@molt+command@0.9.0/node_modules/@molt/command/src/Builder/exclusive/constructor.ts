import type { ParameterSpec } from '../../ParameterSpec/index.js'
import type { ArgumentValueScalar } from '../../ParameterSpec/types.js'
import type { InternalState, SomeBuilderExclusiveInitial } from './types.js'

export const create = (): SomeBuilderExclusiveInitial => {
  const _: InternalState = {
    input: {
      _tag: `Exclusive`,
      optionality: { _tag: `required` },
      parameters: [],
    } satisfies ParameterSpec.Input.Exclusive,
    typeState: undefined as any, // eslint-disable-line
  }

  const chain: SomeBuilderExclusiveInitial = {
    parameter: (nameExpression: string, schemaOrConfiguration) => {
      const configuration =
        `schema` in schemaOrConfiguration ? schemaOrConfiguration : { schema: schemaOrConfiguration }
      _.input.parameters.push({ nameExpression, type: configuration.schema })
      return chain as any // eslint-disable-line
    },
    optional: () => {
      _.input.optionality = { _tag: `optional` }
      return chain
    },
    default: (tag: string, value: ArgumentValueScalar) => {
      _.input.optionality = { _tag: `default`, tag, value }
      return chain
    },
    _,
  }

  return chain
}
