"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeZodType = exports.processBasic = void 0;
const environment_js_1 = require("../helpers/environment.js");
const name_js_1 = require("../helpers/name.js");
const zod_js_1 = require("../helpers/zod.js");
const zod_1 = require("zod");
const processBasic = (expression, input, settings) => {
    const name = (0, name_js_1.processName)(expression);
    const environment = (0, environment_js_1.processEnvironment)(settings, name);
    const typeAnalysis = (0, exports.analyzeZodType)(input);
    const parameter = {
        _tag: `Basic`,
        description: typeAnalysis.description,
        type: typeAnalysis.type,
        optionality: typeAnalysis.optionality,
        prompt: {
            enabled: input.prompt === true
                ? true
                : input.prompt === false
                    ? false
                    : input.prompt === null
                        ? null
                        : input.prompt.enabled ?? null,
            when: input.prompt === null ? null : typeof input.prompt === `object` ? input.prompt.when ?? null : null,
        },
        environment,
        name,
    };
    return parameter;
};
exports.processBasic = processBasic;
const analyzeZodType = (input) => {
    const isOptional = input.type._def.typeName === zod_1.z.ZodFirstPartyTypeKind.ZodOptional;
    const hasDefault = input.type._def.typeName === zod_1.z.ZodFirstPartyTypeKind.ZodDefault;
    // @ts-expect-error todo
    // eslint-disable-next-line
    const defaultGetter = hasDefault ? input.type._def.defaultValue : null;
    const { description, type } = (0, zod_js_1.analyzeZodTypeScalar)(input.type);
    const optionality = (defaultGetter
        ? { _tag: `default`, getValue: () => defaultGetter() }
        : isOptional
            ? { _tag: `optional` }
            : { _tag: `required` });
    return {
        optionality,
        description,
        type,
    };
};
exports.analyzeZodType = analyzeZodType;
//# sourceMappingURL=basic.js.map