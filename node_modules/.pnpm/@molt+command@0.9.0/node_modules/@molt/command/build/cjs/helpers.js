"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.casesExhausted = exports.entries = exports.invertTable = exports.stripeNegatePrefixLoose = exports.stripeNegatePrefix = exports.negateNamePattern = exports.parseEnvironmentVariableBooleanOrThrow = exports.parseEnvironmentVariableBoolean = exports.lowerCaseObjectKeys = exports.getLowerCaseEnvironment = exports.zodPassthrough = exports.stripeDashPrefix = exports.environmentVariableBooleanLookup = exports.BooleanLookup = void 0;
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const zod_1 = require("zod");
exports.BooleanLookup = {
    true: true,
    false: false,
};
exports.environmentVariableBooleanLookup = {
    ...exports.BooleanLookup,
    '1': true,
    '0': false,
};
const stripeDashPrefix = (flagNameInput) => {
    return flagNameInput.replace(/^-+/, ``);
};
exports.stripeDashPrefix = stripeDashPrefix;
const zodPassthrough = () => zod_1.z.any().transform((_) => _);
exports.zodPassthrough = zodPassthrough;
const getLowerCaseEnvironment = () => (0, exports.lowerCaseObjectKeys)(process.env);
exports.getLowerCaseEnvironment = getLowerCaseEnvironment;
const lowerCaseObjectKeys = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
exports.lowerCaseObjectKeys = lowerCaseObjectKeys;
const parseEnvironmentVariableBoolean = (value) => 
// @ts-expect-error ignore
// eslint-disable-next-line
exports.environmentVariableBooleanLookup[value] ?? null;
exports.parseEnvironmentVariableBoolean = parseEnvironmentVariableBoolean;
const parseEnvironmentVariableBooleanOrThrow = (value) => {
    const result = (0, exports.parseEnvironmentVariableBoolean)(value);
    if (result === null) {
        throw new Error(`Invalid boolean value: ${value}`);
    }
    return result;
};
exports.parseEnvironmentVariableBooleanOrThrow = parseEnvironmentVariableBooleanOrThrow;
exports.negateNamePattern = /^no([A-Z].+)/;
const stripeNegatePrefix = (name) => {
    // eslint-disable-next-line
    const withoutPrefix = name.match(exports.negateNamePattern)?.[1];
    if (!withoutPrefix)
        return null;
    const withCamelCase = (0, lodash_camelcase_1.default)(withoutPrefix);
    return withCamelCase;
};
exports.stripeNegatePrefix = stripeNegatePrefix;
const stripeNegatePrefixLoose = (name) => {
    const result = (0, exports.stripeNegatePrefix)(name);
    return result ? result : name;
};
exports.stripeNegatePrefixLoose = stripeNegatePrefixLoose;
const invertTable = (rows) => {
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
exports.invertTable = invertTable;
const entries = (obj) => Object.entries(obj);
exports.entries = entries;
const casesExhausted = (_) => {
    throw new Error(`Cases exhausted: ${_}`); // eslint-disable-line
};
exports.casesExhausted = casesExhausted;
//# sourceMappingURL=helpers.js.map