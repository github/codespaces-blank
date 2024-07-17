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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.Line = exports.Environment = void 0;
const index_js_1 = require("../Errors/index.js");
const prelude_js_1 = require("../lib/prelude.js");
const index_js_2 = require("../ParameterSpec/index.js");
const index_js_3 = require("./Environment/index.js");
const index_js_4 = require("./Line/index.js");
const alge_1 = require("alge");
var index_js_5 = require("./Environment/index.js");
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return index_js_5.Environment; } });
var index_js_6 = require("./Line/index.js");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return index_js_6.Line; } });
__exportStar(require("./types.js"), exports);
const parse = ({ specs, line, environment, }) => {
    const result = {
        globalErrors: [],
        basicParameters: {},
        mutuallyExclusiveParameters: {},
    };
    const envParseResult = index_js_3.Environment.parse(environment, specs);
    const lineParseResult = index_js_4.Line.parse(line, specs);
    result.globalErrors.push(...lineParseResult.globalErrors, ...envParseResult.globalErrors);
    const specsByVariant = (0, prelude_js_1.groupBy)(specs, `_tag`);
    const specVariantsBasicAndUnion = [...(specsByVariant.Basic ?? []), ...(specsByVariant.Union ?? [])];
    /**
     * Handle "basic" parameters. This excludes "Exclusive Parameter Groups" which are handled later.
     */
    for (const spec of specVariantsBasicAndUnion) {
        /**
         * A note about types.
         *
         * The parse result of lines and environment arg inputs contains the associated spec
         * object. The results are generic and the spec variant is not known. In this loop we
         * deal with Basic spec variant only. Thus the args picked must be associated with
         * a Basic spec variant too. But the static type of arg.spec does not reflect this fact.
         * It has not been narrowed.
         *
         * No matter, we can just ignore the possibility to use arg.spec here anyways.
         */
        // todo, a strict mode where errors are NOT ignored from env parsing when line is present
        const argReport = lineParseResult.reports[spec.name.canonical] ?? envParseResult.reports[spec.name.canonical];
        /**
         * An opening argument was given. Process it.
         */
        if (argReport) {
            /**
             * If there were any errors during the input parsing phase then do not continue with the parameter.
             */
            if (argReport.errors.length > 0) {
                result.basicParameters[argReport.spec.name.canonical] = {
                    _tag: `error`,
                    errors: argReport.errors,
                    spec,
                };
                continue;
            }
            /**
             * Given a raw value was correctly passed, validate it according to the parameter spec.
             */
            result.basicParameters[argReport.spec.name.canonical] = alge_1.Alge.match(argReport.value)
                .boolean((argReportValue) => {
                return {
                    _tag: `supplied`,
                    spec,
                    value: argReportValue.negated ? !argReportValue.value : argReportValue.value,
                };
            })
                .else((argReportValue) => {
                const valueTransformed = index_js_2.ParameterSpec.transform(spec, argReportValue.value);
                const validationResult = index_js_2.ParameterSpec.validate(spec, valueTransformed);
                return alge_1.Alge.match(validationResult)
                    .Success((result) => {
                    return {
                        _tag: `supplied`,
                        spec,
                        value: result.value,
                    };
                })
                    .Failure((result) => {
                    return {
                        _tag: `error`,
                        spec,
                        errors: [
                            new index_js_1.Errors.ErrorInvalidArgument({
                                spec,
                                validationErrors: result.errors,
                                value: result.value,
                            }),
                        ],
                    };
                })
                    .done();
            });
            continue;
        }
        /**
         * No opening argument was given. Process this fact according to spec (e.g. ok b/c optional, apply default, ... etc.)
         */
        result.basicParameters[spec.name.canonical] = alge_1.Alge.match(spec.optionality)
            .default((optionality) => {
            let defaultValue;
            try {
                defaultValue = optionality.getValue();
            }
            catch (someError) {
                return {
                    _tag: `error`,
                    spec,
                    errors: [
                        new index_js_1.Errors.ErrorFailedToGetDefaultArgument({
                            spec,
                            cause: (0, prelude_js_1.errorFromUnknown)(someError),
                        }),
                    ],
                };
            }
            return {
                _tag: `supplied`,
                spec,
                value: defaultValue,
            };
        })
            .required(() => {
            return {
                _tag: `error`,
                spec,
                errors: [new index_js_1.Errors.ErrorMissingArgument({ spec })],
            };
        })
            .optional(() => {
            return {
                _tag: `omitted`,
                spec,
            };
        })
            .done();
    }
    // todo this should be turned into a separate sub parser that just returns the object assigned to mutuallyExclusiveParameters
    /**
     * Handle exclusive parameter groups:
     *
     * 1. We must handle each group exactly once.
     * 2. If a group is optional and none of its parameters was given an arg then OK
     * 3. If a group is not optional and none of its parameters was given an arg then error
     * 4. If a group has more than one parameter with an arg then error
     * 5. If a group has exactly one parameter with an arg then OK
     */
    const exclusiveGroupSpecsByGroupLabel = (0, prelude_js_1.groupBy)(specsByVariant.Exclusive ?? [], (spec) => spec.group.label);
    for (const specs of Object.values(exclusiveGroupSpecsByGroupLabel)) {
        const group = specs[0].group; // eslint-disable-line
        const argsToGroup = specs
            .map((_) => lineParseResult.reports[_.name.canonical] ?? envParseResult.reports[_.name.canonical])
            .filter((_) => _ !== undefined);
        if (argsToGroup.length === 0) {
            if (group.optionality._tag === `optional`) {
                result.mutuallyExclusiveParameters[group.label] = {
                    _tag: `omitted`,
                    spec: group,
                };
                continue;
            }
            if (group.optionality._tag === `default`) {
                // Find the parameter that this default targets
                const tag = group.optionality.tag;
                const parameter = specs.find((_) => _.name.canonical === tag);
                if (!parameter) {
                    throw new Error(`Failed to find parameter for exclusive group default. This should be impossible.`);
                }
                // TODO handle error getting default?
                const defaultValue = group.optionality.getValue();
                if (defaultValue) {
                    result.mutuallyExclusiveParameters[group.label] = {
                        _tag: `supplied`,
                        spec: group,
                        parameter,
                        value: {
                            _tag: tag,
                            value: defaultValue,
                        },
                    };
                    continue;
                }
            }
            result.mutuallyExclusiveParameters[group.label] = {
                _tag: `error`,
                spec: group,
                errors: [
                    new index_js_1.Errors.ErrorMissingArgumentForMutuallyExclusiveParameters({
                        group,
                    }),
                ],
            };
            continue;
        }
        if (argsToGroup.length > 1) {
            result.mutuallyExclusiveParameters[group.label] = {
                _tag: `error`,
                spec: group,
                errors: [
                    new index_js_1.Errors.ErrorArgumentsToMutuallyExclusiveParameters({
                        offenses: argsToGroup.map((_) => ({ spec: _.spec, arg: _ })),
                    }),
                ],
            };
            continue;
        }
        if (argsToGroup.length === 1) {
            const arg = argsToGroup[0]; // eslint-disable-line
            result.mutuallyExclusiveParameters[group.label] = {
                _tag: `supplied`,
                spec: group,
                parameter: arg.spec,
                value: {
                    _tag: arg.spec.name.canonical,
                    value: arg.value.value,
                },
            };
            continue;
        }
    }
    // dump({ result })
    return result;
};
exports.parse = parse;
//# sourceMappingURL=OpeningArgs.js.map