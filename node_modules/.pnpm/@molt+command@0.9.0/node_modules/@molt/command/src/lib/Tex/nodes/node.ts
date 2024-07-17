import type { RenderContext, Shape } from './helpers.js'

export abstract class Node {
  abstract render(context: RenderContext): { shape: Shape; value: string }
}
