"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodPrimitiveToPrimitive = exports.getZodPrimitive = exports.getEnum = exports.isOptional = exports.isUnion = exports.stripOptionalAndDefault = void 0;
const zod_1 = require("zod");
const stripOptionalAndDefault = (type) => {
    if (type instanceof zod_1.z.ZodOptional) {
        return (0, exports.stripOptionalAndDefault)(type._def.innerType);
    }
    if (type instanceof zod_1.z.ZodDefault) {
        return (0, exports.stripOptionalAndDefault)(type._def.innerType);
    }
    return type;
};
exports.stripOptionalAndDefault = stripOptionalAndDefault;
const isUnion = (type) => {
    const type_ = (0, exports.stripOptionalAndDefault)(type);
    const isUnion = type_._def.typeName === zod_1.z.ZodFirstPartyTypeKind.ZodUnion;
    return isUnion;
};
exports.isUnion = isUnion;
const isOptional = (schema) => {
    if (schema instanceof zod_1.z.ZodOptional) {
        return true;
    }
    if (schema instanceof zod_1.z.ZodDefault) {
        return true;
    }
    return false;
};
exports.isOptional = isOptional;
const getEnum = (type) => {
    if (!(`_def` in type))
        throw new Error(`Expected a Zod schema.`);
    if (!(`typeName` in type._def))
        throw new Error(`Expected a Zod schema.`);
    if (type instanceof zod_1.z.ZodNullable) {
        return (0, exports.getEnum)(type.unwrap());
    }
    // eslint-disable-next-line
    if (type instanceof zod_1.z.ZodDefault) {
        // eslint-disable-next-line
        return (0, exports.getEnum)(type._def.innerType);
    }
    // eslint-disable-next-line
    if (type instanceof zod_1.z.ZodOptional) {
        return (0, exports.getEnum)(type.unwrap());
    }
    if (type instanceof zod_1.z.ZodEnum) {
        return type;
    }
    return null;
};
exports.getEnum = getEnum;
const getZodPrimitive = (schema) => {
    if (!(`_def` in schema))
        throw new Error(`Expected a Zod schema.`);
    if (!(`typeName` in schema._def))
        throw new Error(`Expected a Zod schema.`);
    // eslint-disable-next-line
    if (schema instanceof zod_1.z.ZodDefault) {
        // if (schema._def.typeName === `ZodDefault`) {
        // eslint-disable-next-line
        return (0, exports.getZodPrimitive)(schema._def.innerType);
    }
    // eslint-disable-next-line
    if (schema instanceof zod_1.z.ZodOptional) {
        // if (schema._def.typeName === `ZodOptional`) {
        // eslint-disable-next-line
        return (0, exports.getZodPrimitive)(schema._def.innerType);
    }
    // eslint-disable-next-line
    return schema._def.typeName;
};
exports.getZodPrimitive = getZodPrimitive;
exports.ZodPrimitiveToPrimitive = {
    ZodBoolean: `boolean`,
    ZodString: `string`,
    ZodEnum: `string`,
    ZodNumber: `number`,
};
//# sourceMappingURL=index_.js.map