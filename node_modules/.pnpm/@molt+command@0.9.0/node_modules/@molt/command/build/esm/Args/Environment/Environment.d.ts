import type { Index } from '../../lib/prelude.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import type { ArgumentReport } from '../types.ts';
export declare const defaultParameterNamePrefixes: string[];
export declare const lookupEnvironmentVariableArgument: (prefixes: string[], environment: Record<string, string | undefined>, parameterName: string) => null | {
    name: string;
    value: string;
};
export type RawInputs = Record<string, string | undefined>;
export declare const parse: (environment: RawInputs, specs: ParameterSpec.Output[]) => Index<ArgumentReport>;
//# sourceMappingURL=Environment.d.ts.map
