import { Errors } from '../Errors/index.js';
import { ParameterSpec } from '../ParameterSpec/index.js';
import { Environment } from './Environment/index.ts';
import { Line } from './Line/index.ts';
export { Environment } from './Environment/index.ts';
export { Line } from './Line/index.ts';
export * from './types.ts';
export declare const parse: (specs: ParameterSpec.Output[], argInputsLine: Line.RawInputs, argInputsEnvironment: Environment.RawInputs) => {
    args: Record<string, unknown>;
    errors: Errors.ErrorMissingArgument[];
};
//# sourceMappingURL=Args.d.ts.map
