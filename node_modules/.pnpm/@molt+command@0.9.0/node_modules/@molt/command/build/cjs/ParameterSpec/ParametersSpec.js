"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrHasType = exports.hasName = exports.getNames = exports.findByName = void 0;
__exportStar(require("./input.js"), exports);
__exportStar(require("./output.js"), exports);
__exportStar(require("./processor/process.js"), exports);
__exportStar(require("./transform.js"), exports);
__exportStar(require("./types.js"), exports);
__exportStar(require("./validate.js"), exports);
const helpers_js_1 = require("../helpers.js");
const findByName = (name, specs) => {
    for (const spec of specs) {
        const result = (0, exports.hasName)(spec, name);
        if (result !== null)
            return spec;
    }
    return null;
};
exports.findByName = findByName;
/**
 * Get all the names of a parameter in array form.
 */
const getNames = (spec) => {
    return [
        ...spec.name.aliases.long,
        ...spec.name.aliases.short,
        ...(spec.name.long === null ? [] : [spec.name.long]),
        ...(spec.name.short === null ? [] : [spec.name.short]),
    ];
};
exports.getNames = getNames;
/**
 * Is one of the parameter's names the given name?
 */
const hasName = (spec, name) => {
    const result = parameterSpecHasNameDo(spec, name, false);
    if ((0, exports.isOrHasType)(spec, `TypeBoolean`)) {
        const nameWithoutNegatePrefix = (0, helpers_js_1.stripeNegatePrefix)(name);
        if (nameWithoutNegatePrefix) {
            return parameterSpecHasNameDo(spec, nameWithoutNegatePrefix, true);
        }
    }
    return result;
};
exports.hasName = hasName;
const isOrHasType = (spec, typeTag) => {
    return spec._tag === `Union`
        ? spec.types.find((_) => _.type._tag === typeTag) !== undefined
        : spec.type._tag === typeTag;
};
exports.isOrHasType = isOrHasType;
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