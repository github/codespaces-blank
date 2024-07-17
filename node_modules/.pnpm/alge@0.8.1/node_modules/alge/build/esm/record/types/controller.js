const tagPropertyNames = [`__typename`, `_tag`, `_type`, `_kind`, `type`, `kind`];
export const getTagProperty = (taggedRecord) => {
    return tagPropertyNames.find((propertyName) => propertyName in taggedRecord);
};
export const getTag = (taggedRecord) => {
    const tagProperty = getTagProperty(taggedRecord);
    // @ts-expect-error - should be there or fallback to undefined.
    return taggedRecord[tagProperty];
};
//# sourceMappingURL=controller.js.map