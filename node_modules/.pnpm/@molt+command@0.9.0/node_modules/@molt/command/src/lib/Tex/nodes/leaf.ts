import { Text } from '../../Text/index.js'
import type { RenderContext } from './helpers.js'
import { Node } from './node.js'

export class Leaf extends Node {
  value: string
  constructor(value: string) {
    super()
    this.value = value
  }
  render(context: RenderContext) {
    const lines = Text.lines(context.maxWidth ?? 1000, this.value)
    const value = lines.join(Text.chars.newline)
    const intrinsicWidth = Math.max(...lines.map((_) => Text.getLength(_)))
    const intrinsicHeight = lines.length
    const valueColored = context.color ? context.color(value) : value
    return {
      shape: {
        intrinsicWidth,
        intrinsicHeight,
        desiredWidth: null,
      },
      value: valueColored,
    }
  }
}
