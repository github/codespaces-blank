"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTag = exports.getTagProperty = void 0;
const tagPropertyNames = [`__typename`, `_tag`, `_type`, `_kind`, `type`, `kind`];
const getTagProperty = (taggedRecord) => {
    return tagPropertyNames.find((propertyName) => propertyName in taggedRecord);
};
exports.getTagProperty = getTagProperty;
const getTag = (taggedRecord) => {
    const tagProperty = (0, exports.getTagProperty)(taggedRecord);
    // @ts-expect-error - should be there or fallback to undefined.
    return taggedRecord[tagProperty];
};
exports.getTag = getTag;
//# sourceMappingURL=controller.js.map