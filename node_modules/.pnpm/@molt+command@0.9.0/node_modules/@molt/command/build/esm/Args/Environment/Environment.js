import { parseRawInput } from '../../helpers.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import camelCase from 'lodash.camelcase';
import snakecase from 'lodash.snakecase';
export const defaultParameterNamePrefixes = [`cli_parameter`, `cli_param`];
// type RawEnvironment = Record<string, string | undefined>
export const lookupEnvironmentVariableArgument = (prefixes, environment, parameterName) => {
    const parameterNameSnakeCase = snakecase(parameterName);
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
export const parse = (environment, specs) => {
    const envars = Object.entries(environment)
        .map(([name, value]) => value === undefined
        ? value
        : {
            name: { raw: name, camel: camelCase(name) },
            value,
        })
        .filter((envar) => envar !== null);
    const reportsIndex = {};
    const specsPool = specs.filter((spec) => spec.environment !== null);
    const specsSeen = {};
    // TODO if envar has prefix that matches a namespace but text after does not match any parameter name then capture error
    // const potentialTypos = []
    // EnvironmentLoop: // prettier-ignore
    for (const envar of envars) {
        for (const spec of specsPool) {
            if (specsSeen[spec.name.canonical])
                continue;
            const report = reportsIndex[spec.name.canonical];
            // eslint-disable-next-line
            const isNamespaced = spec.environment.namespaces.length > 0;
            if (isNamespaced) {
                const specParameterNames = ParameterSpec.getNames(spec);
                // eslint-disable-next-line
                const namespaceAndNameHit = spec
                    .environment.namespaces.flatMap((namespace) => specParameterNames.map((name) => ({ namespace, name })))
                    .flatMap(({ namespace, name }) => [
                    camelCase(`${namespace}_no_${name}`),
                    camelCase(`${namespace}_${name}`),
                ])
                    .find((name) => name === envar.name.camel);
                // dump({namespaceAndNameHit})
                if (namespaceAndNameHit) {
                    // if (envar.value === undefined)
                    //   throw new Error(`Unexpected undefined value for environment variable ${envar.name.raw}`)
                    const value = parseRawInput(envar.name.camel, envar.value, spec);
                    // dump(typeof report)
                    if (report) {
                        report.duplicates.push({
                            value,
                            source: { _tag: `environment`, name: envar.name.raw, namespace: `` },
                        });
                    }
                    else {
                        reportsIndex[spec.name.canonical] = {
                            spec,
                            value,
                            duplicates: [],
                            errors: [],
                            source: { _tag: `environment`, name: envar.name.raw, namespace: `` },
                        };
                    }
                    // TODO short-circuit in unsafe mode for faster parsing but less error reporting
                    // specsSeen[spec.name.canonical] = true
                    // continue EnvironmentLoop
                }
                // .map((enVarName) => ({ enVarName, value: enVar.name.camel === enVarName ? enVar.value : null }))
            }
            else {
                const specParameterNames = ParameterSpec.getNames(spec);
                // dump(specParameterNames, enVar)
                if (specParameterNames.includes(envar.name.camel)) {
                    // eslint-disable-next-line
                    const value = parseRawInput(envar.name.camel, envar.value, spec);
                    // dump({value})
                    if (report) {
                        report.duplicates.push({
                            value,
                            source: { _tag: `environment`, name: envar.name.raw, namespace: `` },
                        });
                    }
                    else {
                        reportsIndex[spec.name.canonical] = {
                            errors: [],
                            spec,
                            value,
                            duplicates: [],
                            source: { _tag: `environment`, name: envar.name.raw, namespace: `` },
                        };
                    }
                    // TODO short-circuit in unsafe mode for faster parsing but less error reporting
                    // specsSeen[spec.name.canonical] = true
                    // continue EnvironmentLoop
                }
            }
        }
    }
    return reportsIndex;
};
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
//# sourceMappingURL=Environment.js.map