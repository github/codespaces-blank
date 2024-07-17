import { z } from 'zod';
export const stripOptionalAndDefault = (type) => {
    if (type instanceof z.ZodOptional) {
        return stripOptionalAndDefault(type._def.innerType);
    }
    if (type instanceof z.ZodDefault) {
        return stripOptionalAndDefault(type._def.innerType);
    }
    return type;
};
export const isUnion = (type) => {
    const type_ = stripOptionalAndDefault(type);
    const isUnion = type_._def.typeName === z.ZodFirstPartyTypeKind.ZodUnion;
    return isUnion;
};
export const isOptional = (schema) => {
    if (schema instanceof z.ZodOptional) {
        return true;
    }
    if (schema instanceof z.ZodDefault) {
        return true;
    }
    return false;
};
export const getEnum = (type) => {
    if (!(`_def` in type))
        throw new Error(`Expected a Zod schema.`);
    if (!(`typeName` in type._def))
        throw new Error(`Expected a Zod schema.`);
    if (type instanceof z.ZodNullable) {
        return getEnum(type.unwrap());
    }
    // eslint-disable-next-line
    if (type instanceof z.ZodDefault) {
        // eslint-disable-next-line
        return getEnum(type._def.innerType);
    }
    // eslint-disable-next-line
    if (type instanceof z.ZodOptional) {
        return getEnum(type.unwrap());
    }
    if (type instanceof z.ZodEnum) {
        return type;
    }
    return null;
};
export const getZodPrimitive = (schema) => {
    if (!(`_def` in schema))
        throw new Error(`Expected a Zod schema.`);
    if (!(`typeName` in schema._def))
        throw new Error(`Expected a Zod schema.`);
    // eslint-disable-next-line
    if (schema instanceof z.ZodDefault) {
        // if (schema._def.typeName === `ZodDefault`) {
        // eslint-disable-next-line
        return getZodPrimitive(schema._def.innerType);
    }
    // eslint-disable-next-line
    if (schema instanceof z.ZodOptional) {
        // if (schema._def.typeName === `ZodOptional`) {
        // eslint-disable-next-line
        return getZodPrimitive(schema._def.innerType);
    }
    // eslint-disable-next-line
    return schema._def.typeName;
};
export const ZodPrimitiveToPrimitive = {
    ZodBoolean: `boolean`,
    ZodString: `string`,
    ZodEnum: `string`,
    ZodNumber: `number`,
};
//# sourceMappingURL=index_.js.map