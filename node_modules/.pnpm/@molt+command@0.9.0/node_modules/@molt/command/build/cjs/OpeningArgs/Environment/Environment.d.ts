import { Errors } from '../../Errors/index.js';
import type { Index } from '../../lib/prelude.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import type { EnvironmentArgumentReport } from '../types.js';
export declare const defaultParameterNamePrefixes: string[];
export type RawInputs = Record<string, string | undefined>;
export type LocalParseErrors = Errors.ErrorDuplicateEnvArg;
export type GlobalParseErrors = Errors.Global.ErrorUnknownParameterViaEnvironment;
export interface ParsedInputs {
    globalErrors: GlobalParseErrors[];
    reports: Index<EnvironmentArgumentReport>;
}
export declare const parse: (environment: RawInputs, specs: ParameterSpec.Output[]) => ParsedInputs;
export declare const lookupEnvironmentVariableArgument: (prefixes: string[], environment: Record<string, string | undefined>, parameterName: string) => null | {
    name: string;
    value: string;
};
//# sourceMappingURL=Environment.d.ts.map