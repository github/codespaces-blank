import { BooleanLookup, negateNamePattern, parseEnvironmentVariableBoolean } from '../helpers.js';
import { Alge } from 'alge';
import camelCase from 'lodash.camelcase';
import { z } from 'zod';
export const stripeDashPrefix = (flagNameInput) => {
    return flagNameInput.replace(/^-+/, ``);
};
export const zodPassthrough = () => z.any().transform((_) => _);
// prettier-ignore
export const parseRawInput = (name, rawValue, spec) => {
    const parsedValue = parseRawValue(rawValue, spec);
    if (parsedValue === null) {
        const expectedTypes = Alge.match(spec).Union((spec) => spec.types.map(_ => _.type._tag).join(` | `)).else(spec => spec.type._tag);
        throw new Error(`Failed to parse input ${name} with value ${rawValue}. Expected type of ${expectedTypes}.`);
    }
    if (typeof parsedValue === `string`)
        return { _tag: `string`, value: parsedValue };
    if (typeof parsedValue === `number`)
        return { _tag: `number`, value: parsedValue };
    if (typeof parsedValue === `boolean`) {
        // dump(isEnvarNegated(name, spec))
        return { _tag: `boolean`, value: parsedValue, negated: isEnvarNegated(name, spec) };
    }
    return casesHandled(parsedValue);
};
const casesHandled = (value) => {
    throw new Error(`Unhandled case ${String(value)}`);
};
/**
 * Is the environment variable input negated? Unlike line input the environment can be
 * namespaced so a bit more work is needed to parse out the name pattern.
 */
export const isEnvarNegated = (name, spec) => {
    const nameWithNamespaceStripped = stripeNamespace(name, spec);
    // dump({ nameWithNamespaceStripped })
    return negateNamePattern.test(nameWithNamespaceStripped);
};
export const isNegated = (name) => {
    return negateNamePattern.test(name);
};
const stripeNamespace = (name, spec) => {
    for (const namespace of spec.environment?.namespaces ?? []) {
        if (name.startsWith(namespace))
            return camelCase(name.slice(namespace.length));
    }
    return name;
};
export const parseRawValue = (value, spec) => {
    return Alge.match(spec)
        .Union((spec) => {
        /**
         * For a union we infer the value to be the type of the first variant type that matches.
         * This means that variant order matters since there are sub/super type relationships.
         * For example a number is a subset of string type. If there is a string and number variant
         * we should first check if the value could be a number, than a string.
         */
        const variantOrder = [
            `TypeNumber`,
            `TypeBoolean`,
            `TypeString`,
            `TypeEnum`,
        ];
        const types = spec.types.sort((a, b) => variantOrder.indexOf(a.type._tag) - variantOrder.indexOf(b.type._tag));
        return (types
            .map((_) => Alge.match(_.type)
            .TypeLiteral((_) => parseLiteral(_, value))
            .TypeString(() => value)
            .TypeEnum((_) => parseEnum(_, value))
            .TypeBoolean(() => parseEnvironmentVariableBoolean(value))
            .TypeNumber(() => {
            const result = Number(value);
            return isNaN(result) ? null : result;
        })
            .done())
            .find((parsedValue) => parsedValue !== null) ?? null);
    })
        .else((spec) => Alge.match(spec.type)
        .TypeLiteral((_) => parseLiteral(_, value))
        .TypeString(() => value)
        .TypeEnum((_) => parseEnum(_, value))
        .TypeBoolean(() => parseEnvironmentVariableBoolean(value))
        .TypeNumber(() => Number(value))
        .done());
};
/**
 * Enums can be given a base type of numbers or strings. Examples:
 *
 * - number: `z.nativeEnum(\{ a: 1, b: 2\})`
 * - string: `z.enum(['a','b','c'])`
 *
 * It is not possible to have an enum that mixes numbers and strings.
 *
 * When we receive a raw value, we infer its base  type based on checking the type first member of the enum.
 */
export const parseEnum = (spec, value) => {
    const isNumberEnum = spec.members.find((_) => typeof _ === `number`);
    if (isNumberEnum)
        return Number(value);
    return value;
};
export const parseLiteral = (spec, value) => {
    if (typeof spec.value === `string`)
        return value;
    if (typeof spec.value === `number`)
        return Number(value);
    if (typeof spec.value === `boolean`) {
        const v = BooleanLookup[value];
        if (!v)
            throw new Error(`Invalid boolean literal value: ${value}`);
        return v;
    }
    return casesHandled(spec.value);
};
//# sourceMappingURL=helpers.js.map