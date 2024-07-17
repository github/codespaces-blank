import { Block } from '../nodes/block.js'
import { Leaf } from '../nodes/leaf.js'
import type { TableParameters } from '../nodes/table.js'
import { Table } from '../nodes/table.js'
import type { BlockBuilder, BlockMethod, BlockMethodArgs } from './block.js'
import { resolveBlockMethodArgs } from './block.js'
import type { NodeImplementor } from './helpers.js'
import { toInternalBuilder } from './helpers.js'

type Childish = BlockBuilder | Block | string | null
type NonNullChildish = Exclude<Childish, null>

// prettier-ignore
export interface TableMethod<Chain> {
  (rows: (Childish[]|null)[])                                                      : Chain
  (builder: NodeImplementor<TableBuilder>)                               : Chain
  (parameters: TableParameters, builder: NodeImplementor<TableBuilder>)  : Chain
}

export type TableMethodArgs =
  | [(Childish[] | null)[]]
  | [TableParameters, NodeImplementor<TableBuilder>]
  | [NodeImplementor<TableBuilder>]

export const resolveTableMethodArgs = (
  args: TableMethodArgs,
): { parameters: TableParameters | null; child: null | Table } => {
  const childrenish = args.length === 1 ? args[0] : args[1]
  const parameters = args.length === 1 ? null : args[0]
  const child =
    typeof childrenish === `function`
      ? toInternalBuilder(childrenish(createTableBuilder()))?._.node ?? null
      : new Table(resolveChildrenish(childrenish))

  return { parameters, child }
}

const resolveChildrenish = (childrenish: (Childish[] | null)[]): Block[][] => {
  const resolved = childrenish
    .filter((_): _ is NonNullChildish[] => _ !== null)
    .map((cells) =>
      cells
        .filter((cell): cell is NonNullChildish => cell !== null)
        .map((cell) =>
          typeof cell === `string`
            ? new Block(new Leaf(cell))
            : cell instanceof Block
            ? cell
            : toInternalBuilder(cell)._.node,
        ),
    )

  return resolved
}

export interface TableBuilder {
  set(parameters: TableParameters): TableBuilder
  row(...cells: Childish[]): TableBuilder
  rows(...rows: (Childish[] | null)[]): TableBuilder
  rows(rows: (Childish[] | null)[]): TableBuilder
  headers(headers: (string | Block)[]): TableBuilder
  header: BlockMethod<TableBuilder>
}

export const createTableBuilder = (): TableBuilder => {
  const parentNode = new Table()
  const $: TableBuilder = {
    set: (parameters) => {
      parentNode.setParameters(parameters)
      return $
    },
    row: (...cells) => {
      const cellsNormalized = cells
        .filter((cell): cell is NonNullChildish => cell !== null)
        .map((cell) =>
          typeof cell === `string`
            ? new Block(new Leaf(cell))
            : cell instanceof Block
            ? cell
            : toInternalBuilder(cell)._.node,
        )
      if (cellsNormalized.length > 0) {
        parentNode.rows.push(cellsNormalized)
      }
      return $
    },
    rows: (...args) => {
      const rows =
        args.length === 1 && Array.isArray(args[0]?.[0])
          ? (args[0] as (Childish[] | null)[])
          : (args as (Childish[] | null)[])

      const rowsNormalized = resolveChildrenish(rows)

      if (rowsNormalized.length > 0) {
        parentNode.rows.push(...rowsNormalized)
      }
      return $
    },
    headers: (headers) => {
      parentNode.headers = headers.map((_) => (_ instanceof Block ? _ : new Block(new Leaf(_))))
      return $
    },
    header: (...args: BlockMethodArgs) => {
      const input = resolveBlockMethodArgs(args)
      if (input.child) {
        if (input.parameters) {
          input.child.setParameters(input.parameters)
        }
        parentNode.headers.push(input.child)
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
