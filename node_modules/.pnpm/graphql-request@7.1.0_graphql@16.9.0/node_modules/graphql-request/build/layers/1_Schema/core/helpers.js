export const readMaybeThunk = (maybeThunk) => 
// @ts-expect-error fixme
typeof maybeThunk === `function` ? maybeThunk() : maybeThunk;
//# sourceMappingURL=helpers.js.map