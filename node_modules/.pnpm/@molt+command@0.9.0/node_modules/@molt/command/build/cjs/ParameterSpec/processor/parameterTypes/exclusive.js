"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processExclusive = void 0;
const environment_js_1 = require("../helpers/environment.js");
const name_js_1 = require("../helpers/name.js");
const zod_js_1 = require("../helpers/zod.js");
const alge_1 = require("alge");
const processExclusive = (label, input, settings) => {
    const parameters = input.parameters.map((_) => {
        const name = (0, name_js_1.processName)(_.nameExpression);
        const environment = (0, environment_js_1.processEnvironment)(settings, name);
        const typeAnalysis = (0, zod_js_1.analyzeZodTypeScalar)(_.type);
        return {
            _tag: `Exclusive`,
            description: typeAnalysis.description,
            type: typeAnalysis.type,
            environment,
            name,
            // See comment/code below: (1)
            group: null, // eslint-disable-line
        };
    });
    /**
     * (1) Link up the group to each value and vice versa. Cannot do this in the above constructor since
     * it would create a copy of group for each value.
     */
    const group = {
        label,
        // Input exclusive default allows default to be value or thunk,
        // while output is always thunk.
        optionality: alge_1.Alge.match(input.optionality)
            .default((_) => ({
            _tag: `default`,
            tag: _.tag,
            getValue: () => (typeof _.value === `function` ? _.value() : _.value),
        }))
            .else((_) => _),
        parameters: {},
    };
    parameters.forEach((_) => {
        _.group = group;
        group.parameters[_.name.canonical] = _;
    });
    return parameters;
};
exports.processExclusive = processExclusive;
//# sourceMappingURL=exclusive.js.map