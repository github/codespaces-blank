import { Args } from '../../Args/index.js';
import { Help } from '../../Help/index.js';
import { getLowerCaseEnvironment, lowerCaseObjectKeys } from '../../helpers.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import { Settings } from '../../Settings/index.js';
import * as ExclusiveBuilder from '../exclusive/constructor.js';
const create = () => {
    const $ = {
        newSettingsBuffer: [],
        settings: null,
        parameterSpecInputs: {},
    };
    const $$ = {
        addParameterBasicOrUnion: (nameExpression, configuration) => {
            const parameter = ParameterSpec.isUnionType(configuration.schema)
                ? ({
                    _tag: `Union`,
                    type: configuration.schema,
                    nameExpression: nameExpression,
                })
                : ({
                    _tag: `Basic`,
                    type: configuration.schema,
                    nameExpression: nameExpression,
                });
            $.parameterSpecInputs[nameExpression] = parameter;
        },
    };
    const chain = {
        description: (description) => {
            $.newSettingsBuffer.push({
                description,
            });
            return chain;
        },
        settings: (newSettings) => {
            $.newSettingsBuffer.push(newSettings);
            return chain;
        },
        parameters: (parametersConfigOrSchemaObject) => {
            Object.entries(parametersConfigOrSchemaObject).forEach(([nameExpression, schemaOrConfig]) => {
                const config = `schema` in schemaOrConfig ? schemaOrConfig : { schema: schemaOrConfig };
                $$.addParameterBasicOrUnion(nameExpression, { schema: config.schema });
            });
            return chain;
        },
        parameter: (nameExpression, typeOrConfiguration) => {
            const configuration = `schema` in typeOrConfiguration ? typeOrConfiguration : { schema: typeOrConfiguration };
            $$.addParameterBasicOrUnion(nameExpression, configuration);
            return chain;
        },
        parametersExclusive: (label, builderContainer) => {
            $.parameterSpecInputs[label] = builderContainer(ExclusiveBuilder.create())._.input; // eslint-disable-line
            return chain;
        },
        parse: (argInputs) => {
            const testDebuggingNoExit = process.env[`testing_molt`] === `true`;
            const argInputsLine = argInputs?.line ?? process.argv.slice(2);
            const argInputsEnvironment = argInputs?.environment
                ? lowerCaseObjectKeys(argInputs.environment)
                : getLowerCaseEnvironment();
            // Resolve settings
            $.settings = {
                ...Settings.getDefaults(argInputsEnvironment),
            };
            $.newSettingsBuffer.forEach((newSettings) => Settings.change($.settings, newSettings, argInputsEnvironment));
            // todo handle concept of specs themselves having errors
            const specsResult = {
                specs: ParameterSpec.process($.parameterSpecInputs, $.settings),
            };
            const argsResult = Args.parse(specsResult.specs, argInputsLine, argInputsEnvironment);
            // eslint-disable-next-line
            // @ts-expect-error
            const askedForHelp = `help` in argsResult.args && argsResult.args.help === true;
            if (askedForHelp) {
                $.settings.onOutput(Help.render(specsResult.specs, $.settings) + `\n`);
                if (!testDebuggingNoExit)
                    process.exit(0);
                return undefined; // When testing, with process.exit mock, we will reach this case
            }
            if (argsResult.errors.length > 0) {
                if ($.settings.helpOnError) {
                    const message = `Cannot run command, you made some mistakes:\n\n` +
                        argsResult.errors.map((_) => _.message).join(`\nX `) +
                        `\n\nHere are the docs for this command:\n`;
                    $.settings.onOutput(message + `\n`);
                    $.settings.onOutput(Help.render(specsResult.specs, $.settings) + `\n`);
                }
                if ($.settings.onError === `exit` && !testDebuggingNoExit) {
                    process.exit(1);
                    return undefined; // When testing, with process.exit mock, we will reach this case
                }
                if (argsResult.errors.length > 1)
                    throw new AggregateError(argsResult.errors);
                else
                    throw argsResult.errors[0];
            }
            if ($.settings.helpOnNoArguments && Object.values(argsResult.args).length === 0) {
                $.settings.onOutput(Help.render(specsResult.specs, $.settings) + `\n`);
                if (!testDebuggingNoExit)
                    process.exit(0);
                throw new Error(`missing args`); // When testing, with process.exit mock, we will reach this case
            }
            return argsResult.args;
        },
    };
    return chain;
};
// prettier-ignore
// @ts-expect-error internal to external
export const createViaParametersExclusive = (...args) => create().parametersExclusive(...args);
// prettier-ignore
// @ts-expect-error internal to external
export const createViaParameter = (...args) => create().parameter(...args);
// prettier-ignore
// @ts-expect-error internal to external
export const createViaDescription = (...args) => create().description(...args);
// prettier-ignore
// @ts-expect-error internal to external
export const createViaParameters = (...args) => create().parameters(...args);
//# sourceMappingURL=runtime.js.map