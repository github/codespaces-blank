import { Block } from '../nodes/block.js'
import { Leaf } from '../nodes/leaf.js'
import type { ListParameters } from '../nodes/list.js'
import { List } from '../nodes/list.js'
import type { NodeImplementor } from './helpers.js'
import { toInternalBuilder } from './helpers.js'

type Childish = string | Block | null
type Childrenish = Childish[] | null
type NonNullChild = Exclude<Childish, null>

// prettier-ignore
export interface ListMethod<Chain> {
  (parameters: ListParameters, children: Childrenish)         : Chain
  (children: Childrenish)                                     : Chain
  (builder: NodeImplementor<ListBuilder>)                     : Chain
}

const resolveChild = <C extends Childish>(child: C): Exclude<C, string> => {
  if (child === null) return null as any
  if (typeof child === `string`) return new Block(new Leaf(child)) as any
  return child as any
}

// prettier-ignore
export type ListArgs =
  | [ListParameters, Childrenish]
  | [Childrenish]
  | [NodeImplementor<ListBuilder>]

// prettier-ignore
export interface ListBuilder {
  set(parameters: ListParameters)   : ListBuilder
  item(child: Childish)             : ListBuilder
  items(...nodes: Childish[])       : ListBuilder
  items(nodes: Childrenish)         : ListBuilder
}

export const createListBuilder = (): ListBuilder => {
  const parentNode = new List()

  const $: ListBuilder = {
    set: (parameters) => {
      parentNode.setParameters(parameters)
      return $
    },
    item: (childish) => {
      const child = resolveChild(childish)
      if (child) {
        parentNode.items.push(child)
      }
      return $
    },
    items: (...args) => {
      const childrenish = args.length === 1 && Array.isArray(args[0]) ? (args[0] as Childrenish) : args

      if (childrenish === null) return $

      const nodes = childrenish.filter((_): _ is NonNullChild => _ !== null).map(resolveChild)

      if (nodes.length > 0) {
        parentNode.items.push(...nodes)
      }
      return $
    },
  }

  // Define Internal Methods
  toInternalBuilder($)._ = {
    node: parentNode,
  }

  return $
}
