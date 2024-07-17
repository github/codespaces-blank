import { stripeDashPrefix } from '../../../helpers.js'
import { partition } from '../../../lib/prelude.js'
import type { Output } from '../../output.js'
import camelCase from 'lodash.camelcase'

/**
 * Parse the specification for a parameter name.
 */
export const processName = (expression: string): Output.Name => {
  const names = expression
    .trim()
    .split(` `)
    .map((exp) => exp.trim())
    .map(stripeDashPrefix)
    .map(camelCase)
    .filter((exp) => exp.length > 0)

  const [shorts, longs] = partition(names, (name) => name.length > 1)

  // User should static error before hitting this at runtime thanks to
  // @molt/types.
  if (shorts.length === 0 && longs.length === 0) {
    throw new Error(`Invalid parameter expression: ${expression}`)
  }

  /**
   * Pick the first of both short/long groups as being the canonical forms of either group.
   * Then get the overall canonical name for the parameter.
   *
   * We've checked about that both groups are not empty. Therefore we know we will have at least
   * one name that thus satisfies the return type. Its tricky to convince TS of the union though
   * so we just use non-null type casts on all the following name values.
   */
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const short = (shorts.shift() ?? null)!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const long = (longs.shift() ?? null)!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const canonical = (long ?? short)!

  return {
    canonical,
    short,
    long,
    aliases: {
      short: shorts,
      long: longs,
    },
  }
}
