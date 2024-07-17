import { invertTable } from '../../../helpers.js'
import { Text } from '../../Text/index.js'
import type { Block } from './block.js'
import type { RenderContext } from './helpers.js'
import { Node } from './node.js'

export interface TableParameters {
  separators?: {
    row?: string | null
    column?: string
  }
}

export class Table extends Node {
  rows: Block[][]
  headers: Block[]
  parameters: TableParameters
  constructor(rows?: Block[][]) {
    super()
    this.rows = rows ?? []
    this.headers = []
    this.parameters = {}
  }
  setParameters(parameters: TableParameters) {
    this.parameters = parameters
    return this
  }
  render(context: RenderContext) {
    const separators = {
      column: this.parameters.separators?.column ?? ` ${Text.chars.pipe} `,
      row: (width: number) => {
        const separator =
          this.parameters.separators?.row === undefined ? `-` : this.parameters.separators?.row
        if (separator === null) {
          return Text.chars.newline
        }
        return `${Text.chars.newline}${separator.repeat(width)}${Text.chars.newline}`
      },
    }
    const rows = this.rows.map((row) => {
      const total = row.length
      const rowsInner = row.map((cell, index) => {
        const r1 = cell.render({
          phase: `inner`,
          color: context.color,
          maxWidth: context.maxWidth,
          height: context.height,
          index: {
            total,
            isFirst: index === 0,
            isLast: index === total - 1,
            position: index,
          },
        })
        return r1
      })
      const maxCellHeight = Math.max(...rowsInner.map((_) => _.shape.intrinsicHeight))
      const rowsOuter = row.map((cell, index) => {
        const r2 = cell.render({
          phase: `outer`,
          color: context.color,
          maxWidth: context.maxWidth,
          height: maxCellHeight,
          index: {
            total,
            isFirst: index === 0,
            isLast: index === total - 1,
            position: index,
          },
        })
        return r2
      })
      return rowsOuter.map((_) => _.value)
    })
    const headers = this.headers.map((cell) => cell.render(context).value)
    const rowsAndHeaders = this.headers.length > 0 ? [headers, ...rows] : rows
    const maxWidthOfEachColumn = invertTable(rowsAndHeaders).map((col) =>
      Math.max(...col.flatMap(Text.toLines).map((_) => Text.getLength(_))),
    )
    const rowsWithCellWidthsNormalized = rowsAndHeaders.map((row) => {
      const maxNumberOfLinesAmongColumns = Math.max(...row.map(Text.toLines).map((lines) => lines.length))
      const row_ = row.map((col) => {
        const numberOfLines = Text.toLines(col).length
        if (numberOfLines < maxNumberOfLinesAmongColumns) {
          return col + Text.chars.newline.repeat(maxNumberOfLinesAmongColumns - numberOfLines)
        }
        return col
      })
      const row__ = row_.map((col, i) =>
        Text.mapLines(col, (line) => Text.padWithin(`right`, maxWidthOfEachColumn[i] ?? 0, ` `, line)),
      )
      return row__
    })
    const rowsWithCellsJoined = rowsWithCellWidthsNormalized.map((r) =>
      Text.joinColumns(r.map(Text.toLines), separators.column),
    )
    const width = Math.max(...rowsWithCellsJoined.flatMap(Text.toLines).map((_) => Text.getLength(_)))
    const value = rowsWithCellsJoined.join(separators.row(width))

    return {
      shape: {
        intrinsicWidth: 0,
        intrinsicHeight: 0,
        desiredWidth: 0,
      },
      value: value,
    }
  }
}
