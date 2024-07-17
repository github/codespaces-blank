"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const prelude_js_1 = require("../lib/prelude.js");
const index_js_1 = require("../lib/Tex/index.js");
const index_js_2 = require("../lib/Text/index.js");
const term_js_1 = require("../term.js");
const chalk_1 = __importDefault(require("chalk"));
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const lodash_snakecase_1 = __importDefault(require("lodash.snakecase"));
const render = (specs_, settings, _settings) => {
    const allSpecs = specs_;
    const specsWithDescription = allSpecs.filter((_) => _.description !== null);
    const specsByKind = (0, prelude_js_1.groupBy)(specs_, `_tag`);
    const basicAndUnionSpecs = [...(specsByKind.Basic ?? []), ...(specsByKind.Union ?? [])] ?? [];
    const allSpecsWithoutHelp = allSpecs
        .filter((_) => _.name.canonical !== `help`)
        .sort((_) => _._tag === `Exclusive`
        ? _.group.optionality._tag === `optional`
            ? 1
            : -1
        : _.optionality._tag === `optional`
            ? 1
            : -1);
    const basicAndUnionSpecsWithoutHelp = basicAndUnionSpecs
        .filter((_) => _.name.canonical !== `help`)
        .sort((_) => (_.optionality._tag === `optional` ? 1 : -1));
    const isAcceptsAnyEnvironmentArgs = basicAndUnionSpecs.filter((_) => _.environment?.enabled).length > 0;
    const isAcceptsAnyMutuallyExclusiveParameters = (specsByKind.Exclusive && specsByKind.Exclusive.length > 0) || false;
    const isEnvironmentEnabled = Object.values(settings.parameters.environment).filter((_) => _.enabled).length > 0;
    const columnTitles = {
        name: `Name`,
        typeDescription: specsWithDescription.length > 0 ? `Type/Description` : `Type`,
        default: `Default`,
        environment: isEnvironmentEnabled ? `Environment (1)` : null,
    };
    const mexGroups = Object.values((0, prelude_js_1.groupBy)(specsByKind.Exclusive ?? [], (_) => _.group.label)).map((_) => _[0].group);
    const noteItems = [];
    if (isAcceptsAnyEnvironmentArgs) {
        noteItems.push(environmentNote(allSpecsWithoutHelp, settings));
    }
    if (isAcceptsAnyMutuallyExclusiveParameters) {
        noteItems.push(`This is a set of mutually exclusive parameters. Only one can be provided at a time. If more than one is provided, execution will fail with an input error.`);
    }
    const output = index_js_1.Tex.Tex({ maxWidth: 82, padding: { bottom: 0, top: 0 } })
        .block(($) => {
        if (!settings.description)
            return null;
        return $.block({ padding: { top: 1, bottom: 1 } }, `ABOUT`).block({ padding: { left: 2 } }, settings.description);
    })
        .block({ padding: { top: 1, bottom: 1 } }, title(`PARAMETERS`))
        .block({ padding: { left: 2 } }, (__) => __.table({ separators: { column: `   `, row: null } }, (__) => __.header({ padding: { right: 2, bottom: 1 } }, chalk_1.default.underline(term_js_1.Term.colors.mute(columnTitles.name)))
        .header({
        minWidth: 8,
        padding: { right: 5 },
    }, chalk_1.default.underline(term_js_1.Term.colors.mute(columnTitles.typeDescription)))
        .header({ padding: { right: 4 } }, chalk_1.default.underline(term_js_1.Term.colors.mute(columnTitles.default)))
        .header(columnTitles.environment ? chalk_1.default.underline(term_js_1.Term.colors.mute(columnTitles.environment)) : null)
        .rows([
        ...basicAndUnionSpecsWithoutHelp.map((spec) => [
            parameterName(spec),
            index_js_1.Tex.block({ maxWidth: 40, padding: { right: 9, bottom: 1 } }, parameterTypeAndDescription(settings, spec)),
            index_js_1.Tex.block({ maxWidth: 24 }, parameterDefault(spec)),
            ...(isEnvironmentEnabled ? [parameterEnvironment(spec, settings)] : []),
        ]),
        ...mexGroups.flatMap((mexGroup) => {
            const default_ = mexGroup.optionality._tag === `default`
                ? `${mexGroup.optionality.tag}@${String(mexGroup.optionality.getValue())}`
                : mexGroup.optionality._tag === `optional`
                    ? `undefined`
                    : labels.required;
            return [
                [
                    index_js_1.Tex.block({ border: { left: term_js_1.Term.colors.dim(`┌`) } }, term_js_1.Term.colors.dim(`─${mexGroup.label} ${`(2)`}`)),
                    ``,
                    default_,
                ],
                ...Object.values(mexGroup.parameters).map((spec) => [
                    parameterName(spec),
                    parameterTypeAndDescription(settings, spec),
                    parameterDefault(spec),
                    ...(isEnvironmentEnabled ? [parameterEnvironment(spec, settings)] : []),
                ]),
                [index_js_1.Tex.block({ border: { left: term_js_1.Term.colors.dim(`└`) } }, term_js_1.Term.colors.dim(`─`))],
            ];
        }),
    ])).block({ color: term_js_1.Term.colors.dim }, ($) => {
        if (noteItems.length === 0) {
            return null;
        }
        return $.block({ padding: { top: 1 }, border: { bottom: `━` }, width: `100%` }, `NOTES`).list({
            bullet: {
                graphic: (index) => `(${index + 1})`,
            },
        }, noteItems);
    }))
        .render();
    return output;
};
exports.render = render;
const environmentNote = (specs, settings) => {
    const isHasSpecsWithCustomEnvironmentNamespace = specs
        .filter((_) => _.environment?.enabled)
        .filter((_) => _.environment.namespaces.filter((_) => settings.parameters.environment.$default.prefix.map(lodash_camelcase_1.default).includes(_)).length !== _.environment.namespaces.length).length > 0;
    let content = ``;
    content +=
        (settings.parameters.environment.$default.enabled ? `Parameters` : `Some parameters (marked in docs)`) +
            ` can be passed arguments via environment variables. Command line arguments take precedence. Environment variable names are snake cased versions of the parameter name (or its aliases), case insensitive. `;
    if (settings.parameters.environment.$default.prefix.length > 0) {
        if (isHasSpecsWithCustomEnvironmentNamespace) {
            content += `By default they must be prefixed with`;
            content += ` ${index_js_2.Text.joinListEnglish(settings.parameters.environment.$default.prefix.map((_) => term_js_1.Term.colors.secondary(index_js_2.Text.toEnvarNameCase(_) + `_`)))} (case insensitive), though some parameters deviate (shown in docs). `;
        }
        else {
            content += `They must be prefixed with`;
            content += ` ${index_js_2.Text.joinListEnglish(settings.parameters.environment.$default.prefix.map((_) => term_js_1.Term.colors.secondary(index_js_2.Text.toEnvarNameCase(_) + `_`)))} (case insensitive). `;
        }
    }
    else {
        content += isHasSpecsWithCustomEnvironmentNamespace
            ? `By default there is no prefix, though some parameters deviate (shown in docs). `
            : `There is no prefix.`;
    }
    content += `Examples:`;
    const examples = specs
        .filter((_) => _.environment?.enabled)
        .slice(0, 3)
        .map((_) => _.environment.namespaces.length > 0
        ? `${term_js_1.Term.colors.secondary(index_js_2.Text.toEnvarNameCase(_.environment.namespaces[0]) + `_`)}${term_js_1.Term.colors.positive(index_js_2.Text.toEnvarNameCase(_.name.canonical))}`
        : term_js_1.Term.colors.positive(index_js_2.Text.toEnvarNameCase(_.name.canonical)))
        .map((_) => `${_}="..."`);
    return index_js_1.Tex.block(($) => $.text(content).list({
        padding: { left: 2 },
        bullet: {
            graphic: index_js_2.Text.chars.arrowRight,
        },
    }, examples));
};
const parameterDefault = (spec) => {
    if (spec._tag === `Exclusive`) {
        return term_js_1.Term.colors.dim(`–`);
    }
    if (spec.optionality._tag === `optional`) {
        return term_js_1.Term.colors.secondary(`undefined`);
    }
    if (spec.optionality._tag === `default`) {
        try {
            return term_js_1.Term.colors.secondary(String(spec.optionality.getValue()));
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            return chalk_1.default.bold(term_js_1.Term.colors.alert(`Error trying to render this default: ${error.message}`));
        }
    }
    return labels.required;
};
const labels = {
    required: chalk_1.default.bold(chalk_1.default.black(term_js_1.Term.colors.alertBoldBg(` REQUIRED `))),
};
const parameterName = (spec) => {
    const isRequired = ((spec._tag === `Basic` || spec._tag === `Union`) && spec.optionality._tag === `required`) ||
        (spec._tag === `Exclusive` && spec.group.optionality._tag === `required`);
    const parameters = spec._tag === `Exclusive`
        ? {
            border: {
                left: (lineNumber) => lineNumber === 0
                    ? term_js_1.Term.colors.accent(`◒ `)
                    : term_js_1.Term.colors.dim(`${index_js_2.Text.chars.borders.vertical} `),
            },
        }
        : {
            padding: {
                bottom: 1,
            },
        };
    return index_js_1.Tex.block(parameters, (__) => __.block(isRequired ? term_js_1.Term.colors.positiveBold(spec.name.canonical) : term_js_1.Term.colors.positive(spec.name.canonical))
        .block(term_js_1.Term.colors.dim(spec.name.aliases.long.join(`, `)) || null)
        .block(term_js_1.Term.colors.dim(spec.name.short ?? ``) || null)
        .block(term_js_1.Term.colors.dim(spec.name.aliases.long.join(`, `)) || null));
};
const parameterTypeAndDescription = (settings, spec) => {
    if (spec._tag === `Union`) {
        const unionMemberIcon = term_js_1.Term.colors.accent(`◒`);
        const isOneOrMoreMembersWithDescription = spec.types.some((_) => _.description !== null);
        const isExpandedMode = isOneOrMoreMembersWithDescription || settings.helpRendering.union.mode === `expandAlways`;
        const isExpandedModeViaForceSetting = isExpandedMode && !isOneOrMoreMembersWithDescription;
        if (isExpandedMode) {
            const types = spec.types.flatMap((_) => {
                return index_js_1.Tex.block({
                    padding: { bottomBetween: isExpandedModeViaForceSetting ? 0 : 1 },
                    border: {
                        left: (index) => `${index === 0 ? unionMemberIcon : term_js_1.Term.colors.dim(index_js_2.Text.chars.borders.vertical)} `,
                    },
                }, (__) => __.block(typeScalar(_.type)).block(_.description));
            });
            return index_js_1.Tex.block((__) => __.block(term_js_1.Term.colors.dim(index_js_2.Text.chars.borders.leftTop + index_js_2.Text.chars.borders.horizontal + `union`))
                .block({ padding: { bottom: 1 }, border: { left: `${term_js_1.Term.colors.dim(index_js_2.Text.chars.borders.vertical)} ` } }, spec.description)
                .block(types)
                .block(term_js_1.Term.colors.dim(index_js_2.Text.chars.borders.leftBottom + index_js_2.Text.chars.borders.horizontal)));
        }
        else {
            const types = spec.types.map((_) => typeTagsToTypeScriptName[_.type._tag]).join(` | `);
            return index_js_1.Tex.block(($) => $.block(types).block(spec.description ?? null));
        }
    }
    // const maybeZodEnum = ZodHelpers.getEnum(spec.zodType)
    return index_js_1.Tex.block({ padding: { bottom: spec._tag === `Exclusive` ? 0 : 1 } }, ($) => $.block(typeScalar(spec.type)).block(spec.description));
};
const parameterEnvironment = (spec, settings) => {
    return spec.environment?.enabled
        ? term_js_1.Term.colors.secondary(index_js_2.Text.chars.check) +
            (spec.environment.enabled && spec.environment.namespaces.length === 0
                ? ` ` + term_js_1.Term.colors.dim(index_js_2.Text.toEnvarNameCase(spec.name.canonical))
                : spec.environment.enabled &&
                    spec.environment.namespaces.filter(
                    // TODO settings normalized should store prefix in camel case
                    (_) => !settings.parameters.environment.$default.prefix.includes((0, lodash_snakecase_1.default)(_))).length > 0
                    ? ` ` +
                        term_js_1.Term.colors.dim(spec.environment.namespaces
                            .map((_) => `${index_js_2.Text.toEnvarNameCase(_)}_${index_js_2.Text.toEnvarNameCase(spec.name.canonical)}`)
                            .join(` ${index_js_2.Text.chars.pipe} `))
                    : ``)
        : term_js_1.Term.colors.dim(index_js_2.Text.chars.x);
};
/**
 * Render an enum type into a column.
 */
const typeEnum = (type) => {
    const separator = term_js_1.Term.colors.accent(` ${index_js_2.Text.chars.pipe} `);
    const members = Object.values(type.members);
    const lines = members.map((member) => term_js_1.Term.colors.positive(String(member))).join(separator);
    // eslint-disable-next-line
    return members.length > 1 ? lines : `${lines} ${term_js_1.Term.colors.dim(`(enum)`)}`;
};
const title = (string) => {
    return index_js_2.Text.line(string.toUpperCase());
};
const typeScalar = (type) => {
    if (type._tag === `TypeEnum`)
        return typeEnum(type);
    return term_js_1.Term.colors.positive(typeTagsToTypeScriptName[type._tag]);
};
const typeTagsToTypeScriptName = {
    TypeLiteral: `literal`,
    TypeString: `string`,
    TypeNumber: `number`,
    TypeEnum: `enum`,
    TypeBoolean: `boolean`,
};
//# sourceMappingURL=Help.js.map