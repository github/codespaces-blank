import type { Index } from '../../lib/prelude.js';
import { ParameterSpec } from '../../ParameterSpec/index.js';
import type { ArgumentReport } from '../types.js';
export type RawInputs = string[];
export declare const parse: (rawLineInputs: RawInputs, specs: ParameterSpec.Output[]) => {
    errors: Error[];
    line: Index<ArgumentReport>;
};
//# sourceMappingURL=Line.d.ts.map