"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasicScalar = exports.getUnionScalar = exports.isUnionType = void 0;
const index_js_1 = require("../lib/zodHelpers/index.js");
const index__js_1 = require("../lib/zodHelpers/index_.js");
const zod_1 = require("zod");
const isUnionType = (type) => {
    const type_ = (0, index__js_1.stripOptionalAndDefault)(type);
    const isUnion = type_._def.typeName === zod_1.z.ZodFirstPartyTypeKind.ZodUnion;
    return isUnion;
};
exports.isUnionType = isUnionType;
const getUnionScalar = (zodType) => {
    const zodScalarType = index_js_1.ZodHelpers.stripOptionalAndDefault(zodType);
    return zodScalarType;
};
exports.getUnionScalar = getUnionScalar;
const getBasicScalar = (zodType) => {
    const type = index_js_1.ZodHelpers.stripOptionalAndDefault(zodType);
    return type;
};
exports.getBasicScalar = getBasicScalar;
//# sourceMappingURL=zod.js.map