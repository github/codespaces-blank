export const inspect = (value) => {
    try {
        return JSON.stringify(value);
    }
    catch {
        return String(value);
    }
};
/**
 * Is the data type schema empty? Empty means it has no properties beyond the standard `_tag` property.
 */
export const isEmptySchema = (schema) => {
    return Object.keys(schema._def.shape()).filter((key) => key !== `_tag`).length > 0;
};
export const tryOrNull = (fn) => {
    try {
        return fn();
    }
    catch {
        return null;
    }
};
export const isEmpty = (value) => {
    if (Array.isArray(value))
        value.length === 0;
    return Object.keys(value).length === 0;
};
export const ensurePeriod = (s) => (s.length > 0 ? (s[s.length - 1] === `.` ? s : s + `.`) : s);
export const code = (s) => `\`${s}\``;
/**
 * Cast the value to `any`
 */
// eslint-disable-next-line
export const asAny = (x) => x;
/**
 * Extend a chaining API with new methods.
 */
export const extendChain = (params) => {
    const wrapperChain = {
        _: {
            innerChain: params.chain.methods,
        },
        ...Object.fromEntries(Object.entries(params.chain.methods).map(([key, f]) => [
            key,
            key === params.chain.terminus
                ? f
                : (...args) => {
                    f(...args);
                    return wrapperChain;
                },
        ])),
        ...params.extensions,
    };
    return wrapperChain;
};
export const applyDefaults = (input, defaults) => {
    const input_ = { ...input };
    for (const entry of Object.entries(defaults)) {
        // @ts-expect-error dynamic
        // eslint-disable-next-line
        input_[entry[0]] = input_[entry[0]] === undefined ? entry[1] : input_[entry[0]];
    }
    return input_;
};
//# sourceMappingURL=utils.js.map