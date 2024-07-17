import { Errors } from '../Errors/index.js';
import { ParameterSpec } from '../ParameterSpec/index.js';
import { Environment } from './Environment/index.js';
import { Line } from './Line/index.js';
export { Environment } from './Environment/index.js';
export { Line } from './Line/index.js';
export * from './types.js';
export declare const parse: (specs: ParameterSpec.Output[], argInputsLine: Line.RawInputs, argInputsEnvironment: Environment.RawInputs) => {
    args: Record<string, unknown>;
    errors: Errors.ErrorMissingArgument[];
};
//# sourceMappingURL=Args.d.ts.map