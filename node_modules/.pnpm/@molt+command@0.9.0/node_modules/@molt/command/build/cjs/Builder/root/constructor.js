"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const helpers_js_1 = require("../../helpers.js");
const index_js_1 = require("../../ParameterSpec/index.js");
const parse_js_1 = require("../../parse/parse.js");
const index_js_2 = require("../../Settings/index.js");
const ExclusiveBuilder = __importStar(require("../exclusive/constructor.js"));
const create = () => {
    const $ = {
        newSettingsBuffer: [],
        settings: null,
        parameterSpecInputs: {},
    };
    const $$ = {
        addParameterBasicOrUnion: (nameExpression, configuration) => {
            const prompt = configuration.prompt ?? null;
            const parameter = index_js_1.ParameterSpec.isUnionType(configuration.schema)
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
                ? (0, helpers_js_1.lowerCaseObjectKeys)(argInputs.environment)
                : (0, helpers_js_1.getLowerCaseEnvironment)();
            $.settings = {
                ...index_js_2.Settings.getDefaults(argInputsEnvironment),
            };
            $.newSettingsBuffer.forEach((newSettings) => index_js_2.Settings.change($.settings, newSettings, argInputsEnvironment));
            return (0, parse_js_1.parse)($.settings, $.parameterSpecInputs, argInputs);
        },
    };
    return chain;
};
exports.create = create;
//# sourceMappingURL=constructor.js.map