const name = `defer`;
export const parseClientDirectiveDefer = (input) => {
    const args = {
        if: typeof input === `boolean` ? input : input.if === undefined ? true : input.if,
        label: typeof input === `boolean` ? undefined : input.label,
    };
    return {
        name,
        args,
    };
};
//# sourceMappingURL=defer.js.map