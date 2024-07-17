const name = `include`;
export const parseClientDirectiveInclude = (input) => {
    const args = {
        if: typeof input === `boolean` ? input : input.if === undefined ? true : input.if,
    };
    return {
        name,
        args,
    };
};
//# sourceMappingURL=include.js.map