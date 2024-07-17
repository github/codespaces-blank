"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupEnvironmentVariableArgument = exports.parse = exports.defaultParameterNamePrefixes = void 0;
const index_js_1 = require("../../Errors/index.js");
const index_js_2 = require("../../ParameterSpec/index.js");
const helpers_js_1 = require("../helpers.js");
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const lodash_snakecase_1 = __importDefault(require("lodash.snakecase"));
exports.defaultParameterNamePrefixes = [`cli_parameter`, `cli_param`];
const parse = (environment, specs) => {
    const result = {
        globalErrors: [],
        reports: {},
    };
    const envars = normalizeEnvironment(environment);
    const specsWithEnvironmentSupport = specs.filter((spec) => spec.environment !== null);
    for (const envar of envars) {
        for (const spec of specsWithEnvironmentSupport) {
            const match = checkInputMatch(envar, spec);
            // Case 1
            if (!match)
                continue;
            // Case 2
            // Check for multiple envars pointing to the same parameter.
            const report = result.reports[spec.name.canonical];
            if (report) {
                const instance = {
                    name: match.name,
                    prefix: match.namespace,
                    value: match.value,
                };
                const e = report.errors.find((_) => _.name === `ErrorDuplicateEnvArg`);
                if (e) {
                    e.instances.push(instance);
                }
                else {
                    report.errors.push(new index_js_1.Errors.ErrorDuplicateEnvArg({
                        spec,
                        instances: [instance],
                    }));
                }
                continue;
            }
            // Case 3
            const value = (0, helpers_js_1.parseRawInput)(match.nameWithNegation, match.value, spec);
            result.reports[spec.name.canonical] = {
                spec,
                value,
                errors: [],
                source: {
                    _tag: `environment`,
                    name: envar.name.raw,
                    namespace: match.namespace,
                },
            };
        }
    }
    return result;
};
exports.parse = parse;
// export const environmentValidate = (params: {
//   parameterSpecs: ParameterSpec[]
//   environment: RawEnvironment
//   settings: Settings.Normalized
// }) => {
//   const { settings, parameterSpecs, environment } = params
//   if (settings.parameters.environment.$default.prefix.length > 0) {
//     const argsPassedVia = Object.entries(environment)
//       .filter(([prefixedName]) => {
//         return Boolean(
//           settings.parameters.environment.$default.prefix.find((prefix) =>
//             prefixedName.startsWith(prefix.toLowerCase())
//           )
//         )
//       })
//       .reduce((acc, [prefixedName, value]) => {
//         // eslint-disable-next-line
//         const prefix = settings.parameters.environment.$default.prefix.find((prefix) =>
//           prefixedName.startsWith(prefix.toLowerCase())
//         )!
//         const envarName = prefixedName.replace(prefix.toLowerCase() + `_`, ``)
//         const envarNameCamel = camelCase(envarName)
//         const isUnknownName =
//           parameterSpecs.find(
//             (spec) =>
//               spec.name.long === envarNameCamel ||
//               spec.name.short === envarNameCamel ||
//               Boolean(spec.name.aliases.long.find((_) => _ === envarNameCamel)) ||
//               Boolean(spec.name.aliases.short.find((_) => _ === envarNameCamel))
//           ) === undefined
//         acc[envarName] = acc[envarName] ?? []
//         // eslint-disable-next-line
//         acc[envarName]!.push({ prefix, value, isUnknownName })
//         return acc
//       }, {} as Record<string, { prefix: string; value: string | undefined; isUnknownName: boolean }[]>)
//     const argsPassedUnknown = Object.entries(argsPassedVia)
//       .filter(([_name, environmentVariables]) => {
//         return Boolean(environmentVariables.find((envar) => envar.isUnknownName))
//       })
//       .map((entry): [string, { prefix: string; value: string | undefined }[]] => [
//         entry[0],
//         entry[1].map((envar) => ({ prefix: envar.prefix, value: envar.value })),
//       ])
//     if (argsPassedUnknown.length > 0) {
//       throw new Error(
//         `Environment variables appearing to be CLI parameter arguments were found but do not correspond to any actual parameters. This probably indicates a typo or some other kind of error: ${JSON.stringify(
//           Object.fromEntries(argsPassedUnknown.sort().map((entry) => [entry[0], entry[1].sort()])),
//           null,
//           2
//         )}`
//       )
//     }
//     const argsPassedMultipleTimesViaDifferentEnvironmentVariables = Object.entries(argsPassedVia)
//       .filter(([_name, environmentVariables]) => {
//         return environmentVariables.length > 1
//       })
//       .map((entry): [string, { prefix: string; value: string | undefined }[]] => [
//         entry[0],
//         entry[1].map((envar) => ({ prefix: envar.prefix, value: envar.value })),
//       ])
//     if (argsPassedMultipleTimesViaDifferentEnvironmentVariables.length > 0) {
//       const params = argsPassedMultipleTimesViaDifferentEnvironmentVariables
//         .map((args) => `"${String(args[0])}"`)
//         .join(`, `)
//       throw new Error(
//         `Parameter(s) ${params} received arguments multiple times via different environment variables: ${JSON.stringify(
//           Object.fromEntries(
//             argsPassedMultipleTimesViaDifferentEnvironmentVariables
//               .sort()
//               .map((entry) => [entry[0], entry[1].sort()])
//           ),
//           null,
//           2
//         )}`
//       )
//     }
//   }
// }
const lookupEnvironmentVariableArgument = (prefixes, environment, parameterName) => {
    const parameterNameSnakeCase = (0, lodash_snakecase_1.default)(parameterName);
    const parameterNames = prefixes.length === 0
        ? [parameterNameSnakeCase]
        : // TODO add test coverage for the snake case conversion of a parameter name
            prefixes.map((prefix) => `${prefix.toLowerCase()}_${parameterNameSnakeCase.toLowerCase()}`);
    const args = parameterNames
        .map((name) => ({ name, value: environment[name] }))
        .filter((arg) => arg.value !== undefined);
    if (args.length === 0)
        return null;
    if (args.length > 1)
        throw new Error(`Multiple environment variables found for same parameter "${parameterName}": ${args.join(`, `)}`);
    // dump(prefixes, environment, parameterName)
    // eslint-disable-next-line
    const environmentVariable = args[0];
    return environmentVariable;
};
exports.lookupEnvironmentVariableArgument = lookupEnvironmentVariableArgument;
/**
 * Find out if an environment variable is input to a spec.
 */
const checkInputMatch = (envar, spec) => {
    const specParameterNames = index_js_2.ParameterSpec.getNames(spec);
    for (const name of specParameterNames) {
        if (spec.environment.namespaces.length > 0) {
            for (const namespace of spec.environment.namespaces) {
                const nameNamespaced = (0, lodash_camelcase_1.default)(`${namespace}_${name}`);
                if (nameNamespaced === envar.name.camel) {
                    return {
                        name,
                        nameWithNegation: name,
                        namespace,
                        negated: false,
                        value: envar.value,
                    };
                }
                const negateParsed = parseNegated(envar.name.camel);
                if (name === negateParsed.name) {
                    return {
                        name,
                        namespace,
                        nameWithNegation: negateParsed.nameWithNegation,
                        negated: true,
                        value: envar.value,
                    };
                }
            }
        }
        else {
            if (envar.name.camel === name) {
                return {
                    name,
                    nameWithNegation: name,
                    namespace: null,
                    negated: false,
                    value: envar.value,
                };
            }
            const negateParsed = parseNegated(envar.name.camel);
            if (negateParsed.name === name) {
                return {
                    name: negateParsed.name,
                    nameWithNegation: negateParsed.nameWithNegation,
                    namespace: null,
                    negated: true,
                    value: envar.value,
                };
            }
        }
    }
    return null;
};
const parseNegated = (string) => {
    // When there is a namespace then, in camel case format, the negate word can begin with a capital letter
    const match = string.match(/(?:^n|N)o([A-Z].*)$/)?.[1];
    return {
        negated: Boolean(match),
        nameWithNegation: match ? `no${match}` : string,
        name: match ? lowercaseFirst(match) : string,
    };
};
const lowercaseFirst = (string) => string.length === 0 ? string : string[0].toLowerCase() + string.slice(1);
const normalizeEnvironment = (environment) => {
    return Object.entries(environment)
        .map(([name, value]) => value === undefined
        ? value
        : {
            value,
            name: {
                raw: name,
                camel: (0, lodash_camelcase_1.default)(name),
            },
        })
        .filter((envar) => envar !== undefined);
};
//# sourceMappingURL=Environment.js.map