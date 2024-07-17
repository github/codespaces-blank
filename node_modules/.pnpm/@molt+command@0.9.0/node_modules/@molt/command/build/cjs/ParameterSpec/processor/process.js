"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.process = void 0;
const basic_js_1 = require("./parameterTypes/basic.js");
const exclusive_js_1 = require("./parameterTypes/exclusive.js");
const union_js_1 = require("./parameterTypes/union.js");
const alge_1 = require("alge");
const zod_1 = require("zod");
/**
 * Process the spec input into a normalized spec.
 */
const process = (inputs, settings) => {
    const inputsWithHelp = settings.help
        ? {
            ...inputs,
            '-h --help': helpParameter,
        }
        : inputs;
    const outputs = Object.entries(inputsWithHelp).flatMap(([expression, input]) => alge_1.Alge.match(input)
        .Basic((_) => [(0, basic_js_1.processBasic)(expression, _, settings)])
        .Union((_) => [(0, union_js_1.processUnion)(expression, _, settings)])
        .Exclusive((_) => (0, exclusive_js_1.processExclusive)(expression, _, settings))
        .done());
    // dump({ outputs })
    return outputs;
};
exports.process = process;
const helpParameter = {
    _tag: `Basic`,
    type: zod_1.z.boolean().default(false),
    nameExpression: `-h --help`,
    prompt: false,
};
//# sourceMappingURL=process.js.map