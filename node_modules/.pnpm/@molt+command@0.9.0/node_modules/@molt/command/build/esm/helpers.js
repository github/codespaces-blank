import camelCase from 'lodash.camelcase';
import { z } from 'zod';
export const BooleanLookup = {
    true: true,
    false: false,
};
export const environmentVariableBooleanLookup = {
    ...BooleanLookup,
    '1': true,
    '0': false,
};
export const stripeDashPrefix = (flagNameInput) => {
    return flagNameInput.replace(/^-+/, ``);
};
export const zodPassthrough = () => z.any().transform((_) => _);
export const getLowerCaseEnvironment = () => lowerCaseObjectKeys(process.env);
export const lowerCaseObjectKeys = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
export const parseEnvironmentVariableBoolean = (value) => 
// @ts-expect-error ignore
// eslint-disable-next-line
environmentVariableBooleanLookup[value] ?? null;
export const parseEnvironmentVariableBooleanOrThrow = (value) => {
    const result = parseEnvironmentVariableBoolean(value);
    if (result === null) {
        throw new Error(`Invalid boolean value: ${value}`);
    }
    return result;
};
export const negateNamePattern = /^no([A-Z].+)/;
export const stripeNegatePrefix = (name) => {
    // eslint-disable-next-line
    const withoutPrefix = name.match(negateNamePattern)?.[1];
    if (!withoutPrefix)
        return null;
    const withCamelCase = camelCase(withoutPrefix);
    return withCamelCase;
};
export const stripeNegatePrefixLoose = (name) => {
    const result = stripeNegatePrefix(name);
    return result ? result : name;
};
export const invertTable = (rows) => {
    const columns = [];
    for (const row of rows) {
        let i = 0;
        for (const col of row) {
            const column = columns[i] || [];
            column.push(col);
            columns[i] = column;
            i++;
        }
    }
    return columns;
};
export const entries = (obj) => Object.entries(obj);
export const casesExhausted = (_) => {
    throw new Error(`Cases exhausted: ${_}`); // eslint-disable-line
};
//# sourceMappingURL=helpers.js.map