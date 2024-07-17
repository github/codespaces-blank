import type { BlockParameters } from '../nodes/block.js'
import type { BlockBuilder } from './block.js'
import { createBlockBuilder } from './block.js'
import type { Builder } from './helpers.js'
import { toInternalBuilder } from './helpers.js'

export interface RootBuilder extends BlockBuilder<RootBuilder> {
  render(): string
}

export const createRootBuilder = (parameters?: BlockParameters): RootBuilder => {
  const builder = createBlockBuilder({ getSuperChain: () => builder }) as RootBuilder
  const builderInternal = toInternalBuilder(builder)
  builderInternal._.node.setParameters({
    maxWidth: process.stdout.columns,
    ...parameters,
  })

  builder.render = () => render(builder)

  return builder
}

export const render = (builder: Builder): string => {
  const result = toInternalBuilder(builder)._.node.render({
    index: {
      isFirst: true,
      isLast: true,
      position: 0,
      total: 1,
    },
  })
  return result.value
}
