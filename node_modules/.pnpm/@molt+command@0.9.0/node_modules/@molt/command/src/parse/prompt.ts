import { Tex } from '../lib/Tex/index_.js'
import { Text } from '../lib/Text/index.js'
import { ParameterSpec } from '../ParameterSpec/index.js'
import { Term } from '../term.js'
import type { ParseProgressPostPrompt, ParseProgressPostPromptAnnotation } from './parse.js'

export interface TTY {
  output: (text: string) => void
  input: (params: { prompt: string }) => string
}

/**
 * Get args from the user interactively via the console for the given parameters.
 */
// export const prompt = (specs: ParameterSpec.Output[], tty: TTY): Record<string, any> => {
export const prompt = (
  parseProgress: ParseProgressPostPromptAnnotation,
  tty: null | TTY,
): Promise<ParseProgressPostPrompt> => {
  if (tty === null) return Promise.resolve(parseProgress as ParseProgressPostPrompt)

  const args: Record<string, any> = {}
  const specs = Object.entries(parseProgress.basicParameters)
    .filter((_) => _[1].prompt.enabled)
    .map((_) => _[1].spec)
  const indexTotal = specs.length
  let indexCurrent = 1
  const gutterWidth = String(indexTotal).length * 2 + 3

  for (const spec of specs) {
    // prettier-ignore
    const question = Tex({ flow: `horizontal`})
        .block({ padding: { right: 2 }}, `${Term.colors.dim(`${indexCurrent}/${indexTotal}`)}`)
        .block((__) =>
          __.block(Term.colors.positive(spec.name.canonical))
            .block((spec.description && Term.colors.dim(spec.description)) ?? null)
        )
      .render()
    tty.output(question)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const arg = tty.input({ prompt: `${Text.pad(`left`, gutterWidth, Text.chars.space, `❯ `)}` })
      const validationResult = ParameterSpec.validate(spec, arg)
      if (validationResult._tag === `Success`) {
        args[spec.name.canonical] = validationResult.value
        tty.output(Text.chars.newline)
        indexCurrent++
        break
      } else {
        tty.output(
          Text.pad(
            `left`,
            gutterWidth,
            ` `,
            Term.colors.alert(`Invalid value: ${validationResult.errors.join(`, `)}`),
          ),
        )
      }
    }
  }

  // todo do not mutate
  const parseProgressPostPrompt = parseProgress as ParseProgressPostPrompt
  for (const [parameterName, arg] of Object.entries(args)) {
    parseProgressPostPrompt.basicParameters[parameterName]!.prompt.arg = arg // eslint-disable-line
  }

  return Promise.resolve(parseProgressPostPrompt)
}

/**
 * A utility for testing prompts. It allows programmatic control of
 * the input and capturing of the output of a prompts session.
 */
export const createMockTTY = () => {
  const state: {
    inputScript: string[]
    history: {
      output: string[]
      input: string[]
      all: string[]
    }
  } = {
    inputScript: [],
    history: {
      input: [],
      output: [],
      all: [],
    },
  }
  const tty: TTY = {
    output: (value) => {
      state.history.output.push(value)
      state.history.all.push(value)
    },
    input: () => {
      const value = state.inputScript.shift()
      if (value === undefined) {
        throw new Error(`No more values in read script.`)
      }
      state.history.input.push(value)
      state.history.all.push(value)
      return value
    },
  }
  return {
    // state,
    history: state.history,
    mock: {
      input: {
        add: (values: string[]) => {
          state.inputScript.push(...values)
        },
        get: () => state.inputScript,
      },
    },
    interface: tty,
  }
}

export type MockTTY = ReturnType<typeof createMockTTY>
