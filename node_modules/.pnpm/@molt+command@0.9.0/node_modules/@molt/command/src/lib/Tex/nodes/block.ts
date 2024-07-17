import { Text } from '../../Text/index.js'
import type { RenderContext } from './helpers.js'
import { applyPadding } from './helpers.js'
import { Leaf } from './leaf.js'
import { Node } from './node.js'

export interface BlockParameters {
  flow?: 'vertical' | 'horizontal'
  minWidth?: number
  maxWidth?: number
  width?: `${number}%`
  color?: (text: string) => string
  border?: {
    corners?: string
    top?: string | ((columnNumber: number) => string)
    left?: string | ((lineNumber: number) => string)
    bottom?: string | ((columnNumber: number) => string)
    right?: string | ((lineNumber: number) => string)
  }
  padding?: {
    top?: number
    topBetween?: number
    left?: number
    bottom?: number
    bottomBetween?: number
    right?: number
  }
  margin?: {
    top?: number
    left?: number
    bottom?: number
    right?: number
  }
}

export class Block extends Node {
  children: Node[]
  parameters: BlockParameters
  renderings: {
    inner: {
      width: number
      height: number
      result: string
    } | null
    outer: {
      width: number
      height: number
      result: string
    } | null
  }
  constructor(parameters: BlockParameters, node: Node)
  constructor(parameters: BlockParameters, nodes: Node[])
  constructor(parameters: BlockParameters, text: string)
  constructor(nodes: Node[])
  constructor(node: Node)
  constructor(text: string)
  constructor()
  constructor(...args: [] | [string | Node | Node[]] | [BlockParameters, string | Node | Node[]]) {
    super()
    const parameters = args.length === 1 || args.length === 0 ? {} : args[0]
    const children = args.length === 0 ? [] : args.length === 1 ? args[0] : args[1]

    this.parameters = parameters

    if (typeof children === `string`) {
      this.children = [new Leaf(children)]
    } else if (Array.isArray(children)) {
      this.children = children
    } else {
      this.children = [children]
    }
    this.renderings = {
      inner: null,
      outer: null,
    }
  }
  addChild(node: Node) {
    this.children.push(node)
    return this
  }
  setParameters(parameters: BlockParameters) {
    this.parameters = parameters
    return this
  }
  render(context: RenderContext) {
    const flow = this.parameters.flow ?? `vertical`

    if (context.phase === `inner` || !context.phase) {
      const widthOwn =
        typeof this.parameters.width === `number`
          ? { type: `absolute` as const, value: this.parameters.width }
          : typeof this.parameters.width === `string`
          ? this.parameters.width.match(/(\d+)%/)
            ? {
                type: `percentage` as const,
                value: parseInt(this.parameters.width.match(/(\d+)%/)![1]!) / 100,
              }
            : null
          : null
      const widthOwnResolved = widthOwn
        ? widthOwn.type === `absolute`
          ? widthOwn.value
          : widthOwn.value * (context.maxWidth ?? 1000)
        : null
      const maxWidthOwn = this.parameters.maxWidth ?? Infinity
      const paddingLeftOwn = this.parameters.padding?.left ?? 0
      const maxWidthResolved =
        Math.min(widthOwnResolved ?? Infinity, maxWidthOwn, context.maxWidth ?? 1000) - paddingLeftOwn
      let intrinsicWidth = 0

      let renderings: string[] = []
      let index = 0
      for (const child of this.children) {
        const rendered = child.render({
          maxWidth: maxWidthResolved,
          height: context.height,
          color: this.parameters.color,
          index: {
            total: this.children.length,
            isFirst: index === 0,
            isLast: index === this.children.length - 1,
            position: index,
          },
        })

        // TODO minWidth should be passed down to children?
        if (this.parameters.minWidth !== undefined) {
          rendered.value = Text.mapLines(rendered.value, (_) =>
            Text.minSpan(`left`, this.parameters.minWidth!, _),
          )
        }
        intrinsicWidth = Math.max(intrinsicWidth, rendered.shape.intrinsicWidth)
        renderings.push(rendered.value)
        index++
      }

      let joined = ``
      let width = 0

      if (flow === `horizontal`) {
        joined = Text.row(
          renderings.map((_) => ({
            lines: _.split(`\n`),
            separator: ``,
          })),
        )

        width = Text.measure(joined).maxWidth
      } else {
        width = widthOwnResolved === null ? intrinsicWidth : maxWidthResolved
        // each line must span the width of the box
        renderings = renderings.map((_) => Text.minSpan(`left`, width, _))
        joined = renderings.join(Text.chars.newline)
      }

      let value = joined

      if (this.parameters.padding) {
        value = applyPadding(value, this.parameters.padding, context)
      }

      const intrinsicHeight = Text.toLines(value).length

      this.renderings.inner = {
        result: value,
        width,
        height: intrinsicHeight,
      }

      if (context.phase) {
        return {
          shape: {
            intrinsicWidth,
            intrinsicHeight,
            desiredWidth: 0,
          },
          value,
        }
      }
    }

    if (context.phase === `outer` || !context.phase) {
      const height = context.height ?? this.renderings.inner!.height
      let value = this.renderings.inner!.result
      const lineIndexes = [...Array(height).keys()]

      const lines = Text.toLines(value)
      const linesWithBorders: string[] = []
      for (const index of lineIndexes) {
        let line = lines[index] ?? ` `.repeat(this.renderings.inner!.width)

        if (this.parameters.border?.left) {
          const spec = this.parameters.border.left
          const symbol = typeof spec === `string` ? spec : spec(index)
          line = symbol + line
        }
        if (this.parameters.border?.right) {
          const spec = this.parameters.border.right
          const symbol = typeof spec === `string` ? spec : spec(index)
          line = line + symbol
        }
        linesWithBorders.push(line)
      }

      /**
       * The horizontal borders (top, bottom) span to the corners of the box.
       *
       * If left/right borders have been added that will affect the width of these
       * horizontal borders.
       *
       * TODO in the future we should have granular corner control. Then, this
       * current behavior can become the default.
       */
      const hadVerticalBorders = this.parameters.border?.left || this.parameters.border?.right
      const selfMeasure = hadVerticalBorders
        ? Text.measure(Text.fromLines(linesWithBorders))
        : { height: this.renderings.inner!.height, maxWidth: this.renderings.inner!.width }
      const widthIndexes = [...Array(selfMeasure.maxWidth).keys()]
      const corners = this.parameters.border?.corners ?? ``
      const width = selfMeasure.maxWidth - Text.getLength(corners) * 2
      const borderTop = this.parameters.border?.top
        ? corners +
          (typeof this.parameters.border.top === `string`
            ? this.parameters.border.top.repeat(width)
            : widthIndexes.map(this.parameters.border.top).join(``)) +
          corners
        : null
      const borderBottom = this.parameters.border?.bottom
        ? corners +
          (typeof this.parameters.border?.bottom === `string`
            ? this.parameters.border.bottom.repeat(width)
            : widthIndexes.map(this.parameters.border.bottom).join(``)) +
          corners
        : null
      const linesRendered = [borderTop, linesWithBorders.join(Text.chars.newline), borderBottom]
        .filter(Boolean)
        .join(Text.chars.newline)

      value = linesRendered

      //todo
      // value = this.parameters.margin?.top
      //   ? Text.chars.newline.repeat(this.parameters.margin.top) + value
      //   : value
      // value = this.parameters.margin?.left
      //   ? Text.indentBlock(value, Text.chars.space.repeat(this.parameters.margin.left))
      //   : value
      // value = this.parameters.margin?.bottom
      //   ? value + Text.chars.newline.repeat(this.parameters.margin.bottom)
      //   : value
      // value = this.parameters.margin?.right
      //   ? Text.fromLines(
      //       Text.toLines(value).map((_) => _ + Text.chars.space.repeat(this.parameters.margin!.right!))
      //     )
      //   : value

      const color = this.parameters.color ?? ((text: string) => text)
      value = color(value)

      const { maxWidth: intrinsicWidth, height: intrinsicHeight } = Text.measure(value)

      this.renderings.outer = {
        result: value,
        width: intrinsicWidth,
        height: intrinsicHeight,
      }

      return {
        shape: {
          intrinsicWidth,
          intrinsicHeight,
          desiredWidth: 0,
        },
        value,
      }
    }

    throw new Error(`Invalid phase`)
  }
}
