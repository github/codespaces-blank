export const isSpecialFieldName = (fieldName) => fieldName.startsWith(`$`);
export const isSelectFieldName = (fieldName) => !isSpecialFieldName(fieldName);
//# sourceMappingURL=helpers.js.map