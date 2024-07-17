"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const helpers_js_1 = require("../../helpers.js");
const index_js_1 = require("../../ParameterSpec/index.js");
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const parse = (rawLineInputs, specs) => {
    // dump(specs)
    const errors = [];
    const rawLineInputsPrepared = rawLineInputs
        .flatMap((lineInput) => {
        if (!isShortFlag(lineInput))
            return [lineInput];
        return stripeShortFlagPrefixUnsafe(lineInput).split(``).map(addShortFlagPrefix);
    })
        .flatMap((lineInput) => {
        if (lineInput.trim() === `=`)
            return [];
        if (!isFlag(lineInput.trim()))
            return [lineInput];
        // Nodejs will not get us empty string input so we are guaranteed a flag name here.
        const [flag, ...value] = lineInput.trim().split(`=`);
        if (value.length === 0)
            return [flag];
        if (value.join(``) === ``)
            return [flag];
        return [flag, value.join(`=`)];
    });
    const reports = {};
    let current = null;
    const finishPendingReport = (pendingReport) => {
        if (pendingReport.value === PENDING_VALUE) {
            /**
             * We have gotten something like this: --foo --bar.
             * We are parsing "foo". Its spec could be a union containing a boolean or just a straight up boolean, or something else.
             * If union with boolean or boolean then we interpret foo argument as being a boolean.
             * Otherwise it is an error.
             */
            if (index_js_1.ParameterSpec.isOrHasType(pendingReport.spec, `TypeBoolean`)) {
                pendingReport.value = {
                    value: true,
                    _tag: `boolean`,
                    negated: (0, helpers_js_1.isNegated)((0, lodash_camelcase_1.default)(pendingReport.source.name)),
                };
            }
            else {
                pendingReport.errors.push(new Error(`Missing argument`));
            }
        }
    };
    for (const rawLineInput of rawLineInputsPrepared) {
        if (isFlag(rawLineInput)) {
            if (current) {
                finishPendingReport(current);
                current = null;
            }
            const flagNameNoDashPrefix = (0, helpers_js_1.stripeDashPrefix)(rawLineInput);
            const flagNameNoDashPrefixCamel = (0, lodash_camelcase_1.default)(flagNameNoDashPrefix);
            const flagNameNoDashPrefixNoNegate = (0, helpers_js_1.stripeNegatePrefixLoose)(flagNameNoDashPrefixCamel);
            const spec = index_js_1.ParameterSpec.findByName(flagNameNoDashPrefixCamel, specs);
            if (!spec) {
                errors.push(new Error(`Unknown flag "${flagNameNoDashPrefixNoNegate}"`));
                continue;
            }
            const existing = reports[spec.name.canonical];
            if (existing) {
                // TODO Handle once we support multiple values (arrays).
                // TODO richer structured info about the duplication. For example if
                // duplicated across aliases, make it easy to report a nice message explaining that.
                errors.push(new Error(`Duplicate flag "${flagNameNoDashPrefixNoNegate}"`));
                continue;
            }
            current = {
                spec,
                errors: [],
                value: PENDING_VALUE,
                duplicates: [],
                source: {
                    _tag: `line`,
                    name: flagNameNoDashPrefix,
                },
            };
            reports[spec.name.canonical] = current;
            continue;
        }
        else if (current) {
            // TODO catch error and put into errors array
            current.value = (0, helpers_js_1.parseRawInput)(current.spec.name.canonical, rawLineInput, current.spec);
            current = null;
            continue;
        }
        else {
            // TODO We got an argument without a flag, we should report an error? Or just ignore?
        }
    }
    // dump({ current })
    if (current) {
        finishPendingReport(current);
        current = null;
    }
    // dump({ reports })
    return {
        errors,
        line: reports,
    };
};
exports.parse = parse;
const isFlag = (lineInput) => isLongFlag(lineInput) || isShortFlag(lineInput);
const isLongFlag = (lineInput) => lineInput.trim().startsWith(`--`);
const isShortFlag = (lineInput) => lineInput.trim().startsWith(`-`) && !lineInput.trim().startsWith(`--`);
const stripeShortFlagPrefixUnsafe = (lineInput) => lineInput.trim().slice(1);
const addShortFlagPrefix = (lineInput) => `-${lineInput}`;
// eslint-disable-next-line
const PENDING_VALUE = `__PENDING__`;
//# sourceMappingURL=Line.js.map