export * from './input.js';
export * from './output.js';
export * from './processor/process.js';
export * from './transform.js';
export * from './types.js';
export * from './validate.js';
import { stripeNegatePrefix } from '../helpers.js';
export const findByName = (name, specs) => {
    for (const spec of specs) {
        const result = hasName(spec, name);
        if (result !== null)
            return spec;
    }
    return null;
};
/**
 * Get all the names of a parameter in array form.
 */
export const getNames = (spec) => {
    return [
        ...spec.name.aliases.long,
        ...spec.name.aliases.short,
        ...(spec.name.long === null ? [] : [spec.name.long]),
        ...(spec.name.short === null ? [] : [spec.name.short]),
    ];
};
/**
 * Is one of the parameter's names the given name?
 */
export const hasName = (spec, name) => {
    const result = parameterSpecHasNameDo(spec, name, false);
    if (isOrHasType(spec, `TypeBoolean`)) {
        const nameWithoutNegatePrefix = stripeNegatePrefix(name);
        if (nameWithoutNegatePrefix) {
            return parameterSpecHasNameDo(spec, nameWithoutNegatePrefix, true);
        }
    }
    return result;
};
export const isOrHasType = (spec, typeTag) => {
    return spec._tag === `Union`
        ? spec.types.find((_) => _.type._tag === typeTag) !== undefined
        : spec.type._tag === typeTag;
};
const parameterSpecHasNameDo = (spec, name, negated) => {
    return spec.name.long === name
        ? { kind: `long`, negated }
        : spec.name.aliases.long.includes(name)
            ? { kind: `longAlias`, negated }
            : // Short names cannot be negated currently so short circuit with the negated check.
                spec.name.short === name
                    ? { kind: `short` }
                    : spec.name.aliases.short.includes(name)
                        ? { kind: `shortAlias` }
                        : null;
};
//# sourceMappingURL=ParametersSpec.js.map