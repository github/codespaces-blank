import { getLowerCaseEnvironment, lowerCaseObjectKeys } from '../../helpers.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import { parse } from '../../parse/parse.js';
import { Settings } from '../../Settings/index.js';
import * as ExclusiveBuilder from '../exclusive/constructor.js';
export const create = () => {
    const $ = {
        newSettingsBuffer: [],
        settings: null,
        parameterSpecInputs: {},
    };
    const $$ = {
        addParameterBasicOrUnion: (nameExpression, configuration) => {
            const prompt = configuration.prompt ?? null;
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
                    prompt,
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
            const argInputsEnvironment = argInputs?.environment
                ? lowerCaseObjectKeys(argInputs.environment)
                : getLowerCaseEnvironment();
            $.settings = {
                ...Settings.getDefaults(argInputsEnvironment),
            };
            $.newSettingsBuffer.forEach((newSettings) => Settings.change($.settings, newSettings, argInputsEnvironment));
            return parse($.settings, $.parameterSpecInputs, argInputs);
        },
    };
    return chain;
};
//# sourceMappingURL=constructor.js.map