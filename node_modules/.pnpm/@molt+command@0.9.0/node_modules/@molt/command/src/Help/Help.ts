import { groupBy } from '../lib/prelude.js'
import { Tex } from '../lib/Tex/index.js'
import { Text } from '../lib/Text/index.js'
import type { ParameterSpec } from '../ParameterSpec/index.js'
import type { Settings } from '../Settings/index.js'
import { Term } from '../term.js'
import chalk from 'chalk'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'

// TODO use
interface RenderSettings {
  /**
   * Should parameter names be displayed with dash prefixes.
   * @defaultValue false
   */
  flagDash?: boolean
  /**
   * Should the help output be colored?
   * @defaultValue true
   */
  color?: boolean
}

export const render = (
  specs_: ParameterSpec.Output[],
  settings: Settings.Output,
  _settings?: RenderSettings,
) => {
  const allSpecs = specs_
  const specsWithDescription = allSpecs.filter((_) => _.description !== null)
  const specsByKind = groupBy(specs_, `_tag`)
  const basicAndUnionSpecs = [...(specsByKind.Basic ?? []), ...(specsByKind.Union ?? [])] ?? []
  const allSpecsWithoutHelp = allSpecs
    .filter((_) => _.name.canonical !== `help`)
    .sort((_) =>
      _._tag === `Exclusive`
        ? _.group.optionality._tag === `optional`
          ? 1
          : -1
        : _.optionality._tag === `optional`
        ? 1
        : -1,
    )

  const basicAndUnionSpecsWithoutHelp = basicAndUnionSpecs
    .filter((_) => _.name.canonical !== `help`)
    .sort((_) => (_.optionality._tag === `optional` ? 1 : -1))
  const isAcceptsAnyEnvironmentArgs = basicAndUnionSpecs.filter((_) => _.environment?.enabled).length > 0
  const isAcceptsAnyMutuallyExclusiveParameters =
    (specsByKind.Exclusive && specsByKind.Exclusive.length > 0) || false
  const isEnvironmentEnabled =
    Object.values(settings.parameters.environment).filter((_) => _.enabled).length > 0

  const columnTitles = {
    name: `Name`,
    typeDescription: specsWithDescription.length > 0 ? `Type/Description` : `Type`,
    default: `Default`,
    environment: isEnvironmentEnabled ? `Environment (1)` : null,
  }

  const mexGroups = Object.values(groupBy(specsByKind.Exclusive ?? [], (_) => _.group.label)).map(
    (_) => _[0]!.group, // eslint-disable-line
  )

  const noteItems: (Tex.Block | string | null)[] = []

  if (isAcceptsAnyEnvironmentArgs) {
    noteItems.push(environmentNote(allSpecsWithoutHelp, settings))
  }

  if (isAcceptsAnyMutuallyExclusiveParameters) {
    noteItems.push(
      `This is a set of mutually exclusive parameters. Only one can be provided at a time. If more than one is provided, execution will fail with an input error.`,
    )
  }

  const output = Tex.Tex({ maxWidth: 82, padding: { bottom: 0, top: 0 } })
    .block(($) => {
      if (!settings.description) return null
      return $.block({ padding: { top: 1, bottom: 1 } }, `ABOUT`).block(
        { padding: { left: 2 } },
        settings.description,
      )
    })
    .block({ padding: { top: 1, bottom: 1 } }, title(`PARAMETERS`))
    .block({ padding: { left: 2 } }, (__) =>
      __.table({ separators: { column: `   `, row: null } }, (__) =>
        __.header({ padding: { right: 2, bottom: 1 } }, chalk.underline(Term.colors.mute(columnTitles.name)))
          .header(
            {
              minWidth: 8,
              padding: { right: 5 },
            },
            chalk.underline(Term.colors.mute(columnTitles.typeDescription)),
          )
          .header({ padding: { right: 4 } }, chalk.underline(Term.colors.mute(columnTitles.default)))
          .header(
            columnTitles.environment ? chalk.underline(Term.colors.mute(columnTitles.environment)) : null,
          )
          .rows([
            ...basicAndUnionSpecsWithoutHelp.map((spec) => [
              parameterName(spec),
              Tex.block(
                { maxWidth: 40, padding: { right: 9, bottom: 1 } },
                parameterTypeAndDescription(settings, spec),
              ),
              Tex.block({ maxWidth: 24 }, parameterDefault(spec)),
              ...(isEnvironmentEnabled ? [parameterEnvironment(spec, settings)] : []),
            ]),
            ...mexGroups.flatMap((mexGroup) => {
              const default_ =
                mexGroup.optionality._tag === `default`
                  ? `${mexGroup.optionality.tag}@${String(mexGroup.optionality.getValue())}`
                  : mexGroup.optionality._tag === `optional`
                  ? `undefined`
                  : labels.required
              return [
                [
                  Tex.block(
                    { border: { left: Term.colors.dim(`┌`) } },
                    Term.colors.dim(`─${mexGroup.label} ${`(2)`}`),
                  ),
                  ``,
                  default_,
                ],
                ...Object.values(mexGroup.parameters).map((spec) => [
                  parameterName(spec),
                  parameterTypeAndDescription(settings, spec),
                  parameterDefault(spec),
                  ...(isEnvironmentEnabled ? [parameterEnvironment(spec, settings)] : []),
                ]),
                [Tex.block({ border: { left: Term.colors.dim(`└`) } }, Term.colors.dim(`─`))],
              ]
            }),
          ]),
      ).block({ color: Term.colors.dim }, ($) => {
        if (noteItems.length === 0) {
          return null
        }
        return $.block({ padding: { top: 1 }, border: { bottom: `━` }, width: `100%` }, `NOTES`).list(
          {
            bullet: {
              graphic: (index) => `(${index + 1})`,
            },
          },
          noteItems,
        )
      }),
    )
    .render()

  return output
}

const environmentNote = (specs: ParameterSpec.Output[], settings: Settings.Output) => {
  const isHasSpecsWithCustomEnvironmentNamespace =
    specs
      .filter((_) => _.environment?.enabled)
      .filter(
        (_) =>
          _.environment!.namespaces.filter((_) =>
            settings.parameters.environment.$default.prefix.map(camelCase).includes(_),
          ).length !== _.environment!.namespaces.length,
      ).length > 0

  let content = ``

  content +=
    (settings.parameters.environment.$default.enabled ? `Parameters` : `Some parameters (marked in docs)`) +
    ` can be passed arguments via environment variables. Command line arguments take precedence. Environment variable names are snake cased versions of the parameter name (or its aliases), case insensitive. `

  if (settings.parameters.environment.$default.prefix.length > 0) {
    if (isHasSpecsWithCustomEnvironmentNamespace) {
      content += `By default they must be prefixed with`
      content += ` ${Text.joinListEnglish(
        settings.parameters.environment.$default.prefix.map((_) =>
          Term.colors.secondary(Text.toEnvarNameCase(_) + `_`),
        ),
      )} (case insensitive), though some parameters deviate (shown in docs). `
    } else {
      content += `They must be prefixed with`
      content += ` ${Text.joinListEnglish(
        settings.parameters.environment.$default.prefix.map((_) =>
          Term.colors.secondary(Text.toEnvarNameCase(_) + `_`),
        ),
      )} (case insensitive). `
    }
  } else {
    content += isHasSpecsWithCustomEnvironmentNamespace
      ? `By default there is no prefix, though some parameters deviate (shown in docs). `
      : `There is no prefix.`
  }

  content += `Examples:`

  const examples = specs
    .filter((_) => _.environment?.enabled)
    .slice(0, 3)
    .map((_) =>
      _.environment!.namespaces.length > 0
        ? `${Term.colors.secondary(
            Text.toEnvarNameCase(_.environment!.namespaces[0]!) + `_`,
          )}${Term.colors.positive(Text.toEnvarNameCase(_.name.canonical))}`
        : Term.colors.positive(Text.toEnvarNameCase(_.name.canonical)),
    )
    .map((_) => `${_}="..."`)

  return Tex.block(($) =>
    $.text(content).list(
      {
        padding: { left: 2 },
        bullet: {
          graphic: Text.chars.arrowRight,
        },
      },
      examples,
    ),
  )
}

const parameterDefault = (spec: ParameterSpec.Output) => {
  if (spec._tag === `Exclusive`) {
    return Term.colors.dim(`–`)
  }

  if (spec.optionality._tag === `optional`) {
    return Term.colors.secondary(`undefined`)
  }

  if (spec.optionality._tag === `default`) {
    try {
      return Term.colors.secondary(String(spec.optionality.getValue()))
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      return chalk.bold(Term.colors.alert(`Error trying to render this default: ${error.message}`))
    }
  }

  return labels.required
}

const labels = {
  required: chalk.bold(chalk.black(Term.colors.alertBoldBg(` REQUIRED `))),
}

const parameterName = (spec: ParameterSpec.Output) => {
  const isRequired =
    ((spec._tag === `Basic` || spec._tag === `Union`) && spec.optionality._tag === `required`) ||
    (spec._tag === `Exclusive` && spec.group.optionality._tag === `required`)

  const parameters: Tex.BlockParameters =
    spec._tag === `Exclusive`
      ? {
          border: {
            left: (lineNumber) =>
              lineNumber === 0
                ? Term.colors.accent(`◒ `)
                : Term.colors.dim(`${Text.chars.borders.vertical} `),
          },
        }
      : {
          padding: {
            bottom: 1,
          },
        }

  return Tex.block(parameters, (__) =>
    __.block(
      isRequired ? Term.colors.positiveBold(spec.name.canonical) : Term.colors.positive(spec.name.canonical),
    )
      .block(Term.colors.dim(spec.name.aliases.long.join(`, `)) || null)
      .block(Term.colors.dim(spec.name.short ?? ``) || null)
      .block(Term.colors.dim(spec.name.aliases.long.join(`, `)) || null),
  )
}

const parameterTypeAndDescription = (settings: Settings.Output, spec: ParameterSpec.Output) => {
  if (spec._tag === `Union`) {
    const unionMemberIcon = Term.colors.accent(`◒`)
    const isOneOrMoreMembersWithDescription = spec.types.some((_) => _.description !== null)
    const isExpandedMode =
      isOneOrMoreMembersWithDescription || settings.helpRendering.union.mode === `expandAlways`
    const isExpandedModeViaForceSetting = isExpandedMode && !isOneOrMoreMembersWithDescription
    if (isExpandedMode) {
      const types = spec.types.flatMap((_) => {
        return Tex.block(
          {
            padding: { bottomBetween: isExpandedModeViaForceSetting ? 0 : 1 },
            border: {
              left: (index) =>
                `${index === 0 ? unionMemberIcon : Term.colors.dim(Text.chars.borders.vertical)} `,
            },
          },
          (__) => __.block(typeScalar(_.type)).block(_.description),
        )
      })
      return Tex.block((__) =>
        __.block(Term.colors.dim(Text.chars.borders.leftTop + Text.chars.borders.horizontal + `union`))
          .block(
            { padding: { bottom: 1 }, border: { left: `${Term.colors.dim(Text.chars.borders.vertical)} ` } },
            spec.description,
          )
          .block(types)
          .block(Term.colors.dim(Text.chars.borders.leftBottom + Text.chars.borders.horizontal)),
      )
    } else {
      const types = spec.types.map((_) => typeTagsToTypeScriptName[_.type._tag]).join(` | `)
      return Tex.block(($) => $.block(types).block(spec.description ?? null))
    }
  }

  // const maybeZodEnum = ZodHelpers.getEnum(spec.zodType)
  return Tex.block({ padding: { bottom: spec._tag === `Exclusive` ? 0 : 1 } }, ($) =>
    $.block(typeScalar(spec.type)).block(spec.description),
  )
}

const parameterEnvironment = (spec: ParameterSpec.Output, settings: Settings.Output) => {
  return spec.environment?.enabled
    ? Term.colors.secondary(Text.chars.check) +
        (spec.environment.enabled && spec.environment.namespaces.length === 0
          ? ` ` + Term.colors.dim(Text.toEnvarNameCase(spec.name.canonical))
          : spec.environment.enabled &&
            spec.environment.namespaces.filter(
              // TODO settings normalized should store prefix in camel case
              (_) => !settings.parameters.environment.$default.prefix.includes(snakeCase(_)),
            ).length > 0
          ? ` ` +
            Term.colors.dim(
              spec.environment.namespaces
                .map((_) => `${Text.toEnvarNameCase(_)}_${Text.toEnvarNameCase(spec.name.canonical)}`)
                .join(` ${Text.chars.pipe} `),
            )
          : ``)
    : Term.colors.dim(Text.chars.x)
}

/**
 * Render an enum type into a column.
 */
const typeEnum = (type: ParameterSpec.TypeEnum) => {
  const separator = Term.colors.accent(` ${Text.chars.pipe} `)
  const members = Object.values(type.members)
  const lines = members.map((member) => Term.colors.positive(String(member))).join(separator)

  // eslint-disable-next-line
  return members.length > 1 ? lines : `${lines} ${Term.colors.dim(`(enum)`)}`
}

const title = (string: string) => {
  return Text.line(string.toUpperCase())
}

const typeScalar = (type: ParameterSpec.Type): string => {
  if (type._tag === `TypeEnum`) return typeEnum(type)
  return Term.colors.positive(typeTagsToTypeScriptName[type._tag])
}

const typeTagsToTypeScriptName = {
  TypeLiteral: `literal`,
  TypeString: `string`,
  TypeNumber: `number`,
  TypeEnum: `enum`,
  TypeBoolean: `boolean`,
}
