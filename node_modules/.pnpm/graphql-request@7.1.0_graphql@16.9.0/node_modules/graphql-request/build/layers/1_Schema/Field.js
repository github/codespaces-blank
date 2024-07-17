export const field = (type, args = null) => {
    return {
        // At type level "type" is not a thunk
        type: type, // eslint-disable-line
        args,
    };
};
//# sourceMappingURL=Field.js.map