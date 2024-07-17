import type { Settings } from '../../../index.js';
import type { Input } from '../../input.js';
import type { Output } from '../../output.js';
import type { ArgumentValueScalar } from '../../types.js';
export declare const processBasic: (expression: string, input: Input.Basic, settings: Settings.Output) => Output.Basic;
export declare const analyzeZodType: (input: Input.Basic) => {
    optionality: {
        _tag: "default";
        getValue: () => ArgumentValueScalar;
    } | {
        _tag: "optional";
        getValue?: undefined;
    } | {
        _tag: "required";
        getValue?: undefined;
    };
    description: string | null;
    type: import("../../types.js").Type;
};
//# sourceMappingURL=basic.d.ts.map