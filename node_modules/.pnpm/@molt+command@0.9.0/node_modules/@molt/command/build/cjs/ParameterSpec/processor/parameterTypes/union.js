"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUnion = void 0;
const types_js_1 = require("../../types.js");
const environment_js_1 = require("../helpers/environment.js");
const name_js_1 = require("../helpers/name.js");
const zod_js_1 = require("../helpers/zod.js");
const zod_1 = require("zod");
const processUnion = (nameExpression, input, settings) => {
    const name = (0, name_js_1.processName)(nameExpression);
    const environment = (0, environment_js_1.processEnvironment)(settings, name);
    const typeAnalysis = analyzeType(input);
    const parameter = {
        _tag: `Union`,
        name,
        environment,
        description: typeAnalysis.description,
        optionality: typeAnalysis.optionality,
        types: typeAnalysis.types,
    };
    return parameter;
};
exports.processUnion = processUnion;
const analyzeType = (input) => {
    const isOptional = input.type._def.typeName === zod_1.z.ZodFirstPartyTypeKind.ZodOptional;
    const hasDefault = input.type._def.typeName === zod_1.z.ZodFirstPartyTypeKind.ZodDefault;
    // console.log(input.type, hasDefault)
    // @ts-expect-error todo
    // eslint-disable-next-line
    const defaultGetter = hasDefault ? input.type._def.defaultValue : null;
    const union = (0, types_js_1.getUnionScalar)(input.type);
    const description = union.description ?? null;
    const types = union._def.options.map((_) => {
        const typeAnalysis = (0, zod_js_1.analyzeZodTypeScalar)(_);
        return {
            zodType: _,
            description: typeAnalysis.description,
            type: typeAnalysis.type,
        };
    });
    const optionality = (defaultGetter
        ? { _tag: `default`, getValue: () => defaultGetter() }
        : isOptional
            ? { _tag: `optional` }
            : { _tag: `required` });
    return {
        optionality,
        description,
        types,
    };
};
//# sourceMappingURL=union.js.map