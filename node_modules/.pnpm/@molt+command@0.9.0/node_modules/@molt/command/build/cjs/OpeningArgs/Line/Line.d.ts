import { Errors } from '../../Errors/index.js';
import type { Index } from '../../lib/prelude.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import type { ArgumentReport } from '../types.js';
export type RawInputs = string[];
export type GlobalParseErrors = Errors.Global.ErrorUnknownFlag;
export type LocalParseErrors = Errors.ErrorMissingArgument | Errors.ErrorDuplicateLineArg;
interface ParsedInputs {
    globalErrors: GlobalParseErrors[];
    reports: Index<ArgumentReport>;
}
/**
 * Parse line input into an intermediary representation that is suited to comparison against
 * the parameter specs.
 */
export declare const parse: (rawLineInputs: RawInputs, specs: ParameterSpec.Output[]) => ParsedInputs;
export {};
//# sourceMappingURL=Line.d.ts.map