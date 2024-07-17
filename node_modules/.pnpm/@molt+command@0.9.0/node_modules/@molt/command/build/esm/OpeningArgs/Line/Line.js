import { Errors } from '../../Errors/index.js';
import { stripeNegatePrefixLoose } from '../../helpers.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import { isNegated, parseRawInput, stripeDashPrefix } from '../helpers.js';
import camelCase from 'lodash.camelcase';
/**
 * Parse line input into an intermediary representation that is suited to comparison against
 * the parameter specs.
 */
export const parse = (rawLineInputs, specs) => {
    const globalErrors = [];
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
    let currentReport = null;
    const finishPendingReport = (pendingReport) => {
        if (pendingReport.value === PENDING_VALUE) {
            /**
             * We have gotten something like this: --foo --bar.
             * We are parsing "foo". Its spec could be a union containing a boolean or just a straight up boolean, or something else.
             * If union with boolean or boolean then we interpret foo argument as being a boolean.
             * Otherwise it is an error.
             */
            if (ParameterSpec.isOrHasType(pendingReport.spec, `TypeBoolean`)) {
                pendingReport.value = {
                    value: true,
                    _tag: `boolean`,
                    negated: isNegated(camelCase(pendingReport.source.name)),
                };
            }
            else {
                pendingReport.errors.push(new Errors.ErrorMissingArgument({ spec: pendingReport.spec }));
            }
        }
    };
    // Do processing
    for (const rawLineInput of rawLineInputsPrepared) {
        if (isFlag(rawLineInput)) {
            if (currentReport) {
                finishPendingReport(currentReport);
                currentReport = null;
            }
            const flagNameNoDashPrefix = stripeDashPrefix(rawLineInput);
            const flagNameNoDashPrefixCamel = camelCase(flagNameNoDashPrefix);
            const flagNameNoDashPrefixNoNegate = stripeNegatePrefixLoose(flagNameNoDashPrefixCamel);
            const spec = ParameterSpec.findByName(flagNameNoDashPrefixCamel, specs);
            if (!spec) {
                globalErrors.push(new Errors.Global.ErrorUnknownFlag({ flagName: flagNameNoDashPrefixNoNegate }));
                continue;
            }
            const existing = reports[spec.name.canonical];
            if (existing) {
                // TODO Handle once we support multiple values (arrays).
                // TODO richer structured info about the duplication. For example if
                // duplicated across aliases, make it easy to report a nice message explaining that.
                existing.errors.push(new Errors.ErrorDuplicateLineArg({
                    spec,
                    flagName: flagNameNoDashPrefixNoNegate,
                }));
                continue;
            }
            currentReport = {
                spec,
                errors: [],
                value: PENDING_VALUE,
                source: {
                    _tag: `line`,
                    name: flagNameNoDashPrefix,
                },
            };
            reports[spec.name.canonical] = currentReport;
            continue;
        }
        else if (currentReport) {
            // TODO catch error and put into errors array
            currentReport.value = parseRawInput(currentReport.spec.name.canonical, rawLineInput, currentReport.spec);
            currentReport = null;
            continue;
        }
        else {
            // TODO We got an argument without a flag, we should report an error? Or just ignore?
        }
    }
    if (currentReport) {
        finishPendingReport(currentReport);
        currentReport = null;
    }
    return {
        globalErrors,
        reports: reports,
    };
};
const isFlag = (lineInput) => isLongFlag(lineInput) || isShortFlag(lineInput);
const isLongFlag = (lineInput) => lineInput.trim().startsWith(`--`);
const isShortFlag = (lineInput) => lineInput.trim().startsWith(`-`) && !lineInput.trim().startsWith(`--`);
const stripeShortFlagPrefixUnsafe = (lineInput) => lineInput.trim().slice(1);
const addShortFlagPrefix = (lineInput) => `-${lineInput}`;
// eslint-disable-next-line
const PENDING_VALUE = `__PENDING__`;
//# sourceMappingURL=Line.js.map