"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaults = exports.change = void 0;
const eventPatterns_js_1 = require("../eventPatterns.js");
const helpers_js_1 = require("../helpers.js");
const Environment_js_1 = require("../OpeningArgs/Environment/Environment.js");
const lodash_snakecase_1 = __importDefault(require("lodash.snakecase"));
// eslint-disable-next-line
const change = (current, input, environment) => {
    if (input.prompt !== undefined) {
        if (typeof input.prompt === `boolean`) {
            current.prompt.enabled = input.prompt;
        }
        else {
            if (input.prompt.enabled !== undefined)
                current.prompt.enabled = input.prompt.enabled;
            if (input.prompt.when !== undefined) {
                current.prompt.when = input.prompt.when;
                // Passing object makes enabled default to true
                if (input.prompt.enabled === undefined)
                    current.prompt.enabled = true;
            }
        }
    }
    current.onError = input.onError ?? current.onError;
    current.description = input.description ?? current.description;
    current.helpOnNoArguments = input.helpOnNoArguments ?? current.helpOnNoArguments;
    current.helpOnError = input.helpOnError ?? current.helpOnError;
    current.helpRendering = {
        union: {
            ...current.helpRendering.union,
            ...input.helpRendering?.union,
        },
    };
    current.onOutput = input.onOutput
        ? (_) => {
            input.onOutput(_, process.stdout.write.bind(process.stdout));
        }
        : current.onOutput;
    if (input.parameters !== undefined) {
        if (input.help) {
            current.help = input.help;
        }
        // Handle environment
        if (input.parameters.environment !== undefined) {
            const explicitGlobalToggle = environment.cli_settings_read_arguments_from_environment
                ? (0, helpers_js_1.parseEnvironmentVariableBooleanOrThrow)(environment.cli_settings_read_arguments_from_environment)
                : null;
            if (explicitGlobalToggle === false) {
                current.parameters.environment.$default.enabled = false;
            }
            else {
                if (typeof input.parameters.environment === `boolean`) {
                    current.parameters.environment.$default.enabled = input.parameters.environment;
                }
                else {
                    // As soon as the settings begin to specify explicit parameter settings
                    // AND there is NO explicit default toggle setting, then we disable all the rest by default.
                    // prettier-ignore
                    if (input.parameters.environment.$default === undefined ||
                        typeof input.parameters.environment.$default !== `boolean` && input.parameters.environment.$default.enabled === undefined) {
                        const parameterEnvironmentSpecs = Object.keys(input.parameters.environment).filter((k) => k !== `$default`);
                        current.parameters.environment.$default.enabled = parameterEnvironmentSpecs.length === 0;
                    }
                    for (const [parameterName, spec] of Object.entries(input.parameters.environment)) {
                        let spec_ = current.parameters.environment[parameterName];
                        if (!spec_) {
                            spec_ = {};
                            current.parameters.environment[parameterName] = spec_;
                        }
                        if (typeof spec === `boolean`) {
                            spec_.enabled = spec;
                        }
                        else {
                            // Handle enabled
                            if (parameterName === `$default`) {
                                if (spec.enabled !== undefined) {
                                    spec_.enabled = spec.enabled;
                                }
                            }
                            else {
                                spec_.enabled = spec.enabled ?? true;
                            }
                            // Handle prefix
                            if (spec.prefix !== undefined) {
                                if (spec.prefix === false) {
                                    spec_.prefix = [];
                                }
                                else if (spec.prefix === true) {
                                    spec_.prefix = Environment_js_1.defaultParameterNamePrefixes;
                                }
                                else if (typeof spec.prefix === `string`) {
                                    spec_.prefix = [(0, lodash_snakecase_1.default)(spec.prefix).toLowerCase()];
                                }
                                else {
                                    spec_.prefix = spec.prefix.map((prefix) => (0, lodash_snakecase_1.default)(prefix).toLowerCase());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.change = change;
const isEnvironmentEnabled = (lowercaseEnv) => {
    return lowercaseEnv[`cli_settings_read_arguments_from_environment`]
        ? //eslint-disable-next-line
            (0, helpers_js_1.parseEnvironmentVariableBooleanOrThrow)(lowercaseEnv[`cli_settings_read_arguments_from_environment`])
        : // : processEnvLowerCase[`cli_environment_arguments`]
            // ? //eslint-disable-next-line
            //   parseEnvironmentVariableBoolean(processEnvLowerCase[`cli_environment_arguments`]!)
            // : processEnvLowerCase[`cli_env_args`]
            // ? //eslint-disable-next-line
            //   parseEnvironmentVariableBoolean(processEnvLowerCase[`cli_env_args`]!)
            // : processEnvLowerCase[`cli_env_arguments`]
            // ? //eslint-disable-next-line
            //   parseEnvironmentVariableBoolean(processEnvLowerCase[`cli_env_arguments`]!)
            true;
};
const getDefaults = (lowercaseEnv) => {
    return {
        prompt: {
            enabled: false,
            when: eventPatterns_js_1.eventPatterns.rejectedMissingOrInvalid,
        },
        help: true,
        helpOnNoArguments: true,
        helpOnError: true,
        helpRendering: {
            union: {
                mode: `expandOnParameterDescription`,
            },
        },
        onError: `exit`,
        onOutput: (_) => process.stdout.write(_),
        parameters: {
            environment: {
                $default: {
                    enabled: isEnvironmentEnabled(lowercaseEnv),
                    prefix: Environment_js_1.defaultParameterNamePrefixes,
                },
            },
        },
    };
};
exports.getDefaults = getDefaults;
//# sourceMappingURL=settings.js.map