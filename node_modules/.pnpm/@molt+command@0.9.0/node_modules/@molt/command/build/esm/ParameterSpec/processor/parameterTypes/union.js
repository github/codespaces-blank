import { getUnionScalar } from '../../types.js';
import { processEnvironment } from '../helpers/environment.js';
import { processName } from '../helpers/name.js';
import { analyzeZodTypeScalar } from '../helpers/zod.js';
import { z } from 'zod';
export const processUnion = (nameExpression, input, settings) => {
    const name = processName(nameExpression);
    const environment = processEnvironment(settings, name);
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
const analyzeType = (input) => {
    const isOptional = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional;
    const hasDefault = input.type._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault;
    // console.log(input.type, hasDefault)
    // @ts-expect-error todo
    // eslint-disable-next-line
    const defaultGetter = hasDefault ? input.type._def.defaultValue : null;
    const union = getUnionScalar(input.type);
    const description = union.description ?? null;
    const types = union._def.options.map((_) => {
        const typeAnalysis = analyzeZodTypeScalar(_);
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