import { processEnvironment } from '../helpers/environment.js';
import { processName } from '../helpers/name.js';
import { analyzeZodTypeScalar } from '../helpers/zod.js';
import { z } from 'zod';
export const processBasic = (expression, input, settings) => {
    const name = processName(expression);
    const environment = processEnvironment(settings, name);
    const typeAnalysis = analyzeZodType(input);
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
export const analyzeZodType = (input) => {
    const isOptional = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional;
    const hasDefault = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault;
    // @ts-expect-error todo
    // eslint-disable-next-line
    const defaultGetter = hasDefault ? input.type._def.defaultValue : null;
    const { description, type } = analyzeZodTypeScalar(input.type);
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
//# sourceMappingURL=basic.js.map