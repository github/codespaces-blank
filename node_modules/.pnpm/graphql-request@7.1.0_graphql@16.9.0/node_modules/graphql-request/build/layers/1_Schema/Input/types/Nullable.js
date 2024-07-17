export const Nullable = (type) => ({
    kind: `nullable`,
    // at type level "type" is not a thunk
    type: type, // eslint-disable-line
});
export const unwrapNullable = (type) => {
    if (type.kind === `nullable`)
        return type.type;
    // @ts-expect-error fixme
    return type;
};
//# sourceMappingURL=Nullable.js.map