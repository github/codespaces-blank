import { ParameterSpec } from '../ParameterSpec/index.js';
import { Environment } from './Environment/index.js';
import { Line } from './Line/index.js';
import type { ParseResult } from './types.js';
export { Environment } from './Environment/index.js';
export { Line } from './Line/index.js';
export * from './types.js';
export declare const parse: ({ specs, line, environment, }: {
    specs: ParameterSpec.Output[];
    line: Line.RawInputs;
    environment: Environment.RawInputs;
}) => ParseResult;
//# sourceMappingURL=OpeningArgs.d.ts.map