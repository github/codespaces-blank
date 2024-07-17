"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLiteral = exports.parseEnum = exports.parseRawValue = exports.isNegated = exports.isEnvarNegated = exports.parseRawInput = exports.zodPassthrough = exports.stripeDashPrefix = void 0;
const helpers_js_1 = require("../helpers.js");
const alge_1 = require("alge");
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const zod_1 = require("zod");
const stripeDashPrefix = (flagNameInput) => {
    return flagNameInput.replace(/^-+/, ``);
};
exports.stripeDashPrefix = stripeDashPrefix;
const zodPassthrough = () => zod_1.z.any().transform((_) => _);
exports.zodPassthrough = zodPassthrough;
// prettier-ignore
const parseRawInput = (name, rawValue, spec) => {
    const parsedValue = (0, exports.parseRawValue)(rawValue, spec);
    if (parsedValue === null) {
        const expectedTypes = alge_1.Alge.match(spec).Union((spec) => spec.types.map(_ => _.type._tag).join(` | `)).else(spec => spec.type._tag);
        throw new Error(`Failed to parse input ${name} with value ${rawValue}. Expected type of ${expectedTypes}.`);
    }
    if (typeof parsedValue === `string`)
        return { _tag: `string`, value: parsedValue };
    if (typeof parsedValue === `number`)
        return { _tag: `number`, value: parsedValue };
    if (typeof parsedValue === `boolean`) {
        // dump(isEnvarNegated(name, spec))
        return { _tag: `boolean`, value: parsedValue, negated: (0, exports.isEnvarNegated)(name, spec) };
    }
    return casesHandled(parsedValue);
};
exports.parseRawInput = parseRawInput;
const casesHandled = (value) => {
    throw new Error(`Unhandled case ${String(value)}`);
};
/**
 * Is the environment variable input negated? Unlike line input the environment can be
 * namespaced so a bit more work is needed to parse out the name pattern.
 */
const isEnvarNegated = (name, spec) => {
    const nameWithNamespaceStripped = stripeNamespace(name, spec);
    // dump({ nameWithNamespaceStripped })
    return helpers_js_1.negateNamePattern.test(nameWithNamespaceStripped);
};
exports.isEnvarNegated = isEnvarNegated;
const isNegated = (name) => {
    return helpers_js_1.negateNamePattern.test(name);
};
exports.isNegated = isNegated;
const stripeNamespace = (name, spec) => {
    for (const namespace of spec.environment?.namespaces ?? []) {
        if (name.startsWith(namespace))
            return (0, lodash_camelcase_1.default)(name.slice(namespace.length));
    }
    return name;
};
const parseRawValue = (value, spec) => {
    return alge_1.Alge.match(spec)
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
            .map((_) => alge_1.Alge.match(_.type)
            .TypeLiteral((_) => (0, exports.parseLiteral)(_, value))
            .TypeString(() => value)
            .TypeEnum((_) => (0, exports.parseEnum)(_, value))
            .TypeBoolean(() => (0, helpers_js_1.parseEnvironmentVariableBoolean)(value))
            .TypeNumber(() => {
            const result = Number(value);
            return isNaN(result) ? null : result;
        })
            .done())
            .find((parsedValue) => parsedValue !== null) ?? null);
    })
        .else((spec) => alge_1.Alge.match(spec.type)
        .TypeLiteral((_) => (0, exports.parseLiteral)(_, value))
        .TypeString(() => value)
        .TypeEnum((_) => (0, exports.parseEnum)(_, value))
        .TypeBoolean(() => (0, helpers_js_1.parseEnvironmentVariableBoolean)(value))
        .TypeNumber(() => Number(value))
        .done());
};
exports.parseRawValue = parseRawValue;
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
const parseEnum = (spec, value) => {
    const isNumberEnum = spec.members.find((_) => typeof _ === `number`);
    if (isNumberEnum)
        return Number(value);
    return value;
};
exports.parseEnum = parseEnum;
const parseLiteral = (spec, value) => {
    if (typeof spec.value === `string`)
        return value;
    if (typeof spec.value === `number`)
        return Number(value);
    if (typeof spec.value === `boolean`) {
        const v = helpers_js_1.BooleanLookup[value];
        if (!v)
            throw new Error(`Invalid boolean literal value: ${value}`);
        return v;
    }
    return casesHandled(spec.value);
};
exports.parseLiteral = parseLiteral;
//# sourceMappingURL=helpers.js.map