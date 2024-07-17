"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processName = void 0;
const helpers_js_1 = require("../../../helpers.js");
const prelude_js_1 = require("../../../lib/prelude.js");
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
/**
 * Parse the specification for a parameter name.
 */
const processName = (expression) => {
    const names = expression
        .trim()
        .split(` `)
        .map((exp) => exp.trim())
        .map(helpers_js_1.stripeDashPrefix)
        .map(lodash_camelcase_1.default)
        .filter((exp) => exp.length > 0);
    const [shorts, longs] = (0, prelude_js_1.partition)(names, (name) => name.length > 1);
    // User should static error before hitting this at runtime thanks to
    // @molt/types.
    if (shorts.length === 0 && longs.length === 0) {
        throw new Error(`Invalid parameter expression: ${expression}`);
    }
    /**
     * Pick the first of both short/long groups as being the canonical forms of either group.
     * Then get the overall canonical name for the parameter.
     *
     * We've checked about that both groups are not empty. Therefore we know we will have at least
     * one name that thus satisfies the return type. Its tricky to convince TS of the union though
     * so we just use non-null type casts on all the following name values.
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const short = (shorts.shift() ?? null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const long = (longs.shift() ?? null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canonical = (long ?? short);
    return {
        canonical,
        short,
        long,
        aliases: {
            short: shorts,
            long: longs,
        },
    };
};
exports.processName = processName;
//# sourceMappingURL=name.js.map