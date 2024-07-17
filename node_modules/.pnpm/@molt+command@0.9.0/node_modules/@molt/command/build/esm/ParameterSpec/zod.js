import { ZodHelpers } from '../lib/zodHelpers/index.js';
import { stripOptionalAndDefault } from '../lib/zodHelpers/index_.js';
import { z } from 'zod';
export const isUnionType = (type) => {
    const type_ = stripOptionalAndDefault(type);
    const isUnion = type_._def.typeName === z.ZodFirstPartyTypeKind.ZodUnion;
    return isUnion;
};
export const getUnionScalar = (zodType) => {
    const zodScalarType = ZodHelpers.stripOptionalAndDefault(zodType);
    return zodScalarType;
};
export const getBasicScalar = (zodType) => {
    const type = ZodHelpers.stripOptionalAndDefault(zodType);
    return type;
};
//# sourceMappingURL=zod.js.map