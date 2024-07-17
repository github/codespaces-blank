"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDefaults = exports.extendChain = exports.asAny = exports.code = exports.ensurePeriod = exports.isEmpty = exports.tryOrNull = exports.isEmptySchema = exports.inspect = void 0;
const inspect = (value) => {
    try {
        return JSON.stringify(value);
    }
    catch {
        return String(value);
    }
};
exports.inspect = inspect;
/**
 * Is the data type schema empty? Empty means it has no properties beyond the standard `_tag` property.
 */
const isEmptySchema = (schema) => {
    return Object.keys(schema._def.shape()).filter((key) => key !== `_tag`).length > 0;
};
exports.isEmptySchema = isEmptySchema;
const tryOrNull = (fn) => {
    try {
        return fn();
    }
    catch {
        return null;
    }
};
exports.tryOrNull = tryOrNull;
const isEmpty = (value) => {
    if (Array.isArray(value))
        value.length === 0;
    return Object.keys(value).length === 0;
};
exports.isEmpty = isEmpty;
const ensurePeriod = (s) => (s.length > 0 ? (s[s.length - 1] === `.` ? s : s + `.`) : s);
exports.ensurePeriod = ensurePeriod;
const code = (s) => `\`${s}\``;
exports.code = code;
/**
 * Cast the value to `any`
 */
// eslint-disable-next-line
const asAny = (x) => x;
exports.asAny = asAny;
/**
 * Extend a chaining API with new methods.
 */
const extendChain = (params) => {
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
exports.extendChain = extendChain;
const applyDefaults = (input, defaults) => {
    const input_ = { ...input };
    for (const entry of Object.entries(defaults)) {
        // @ts-expect-error dynamic
        // eslint-disable-next-line
        input_[entry[0]] = input_[entry[0]] === undefined ? entry[1] : input_[entry[0]];
    }
    return input_;
};
exports.applyDefaults = applyDefaults;
//# sourceMappingURL=utils.js.map