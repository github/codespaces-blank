const name = `skip`;
export const parseClientDirectiveSkip = (input) => {
    const args = {
        if: typeof input === `boolean` ? input : input.if === undefined ? true : input.if,
    };
    return {
        name,
        args,
    };
};
//# sourceMappingURL=skip.js.map