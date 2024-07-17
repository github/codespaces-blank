import type { Mock } from 'vitest';
import { Anyware } from './__.js';
import { type ExtensionInput, type Options } from './main.js';
export type Input = {
    value: string;
};
export declare const initialInput: Input;
type $Core = ReturnType<typeof createAnyware> & {
    hooks: {
        a: Mock;
        b: Mock;
    };
};
export declare const createAnyware: () => Anyware.Builder<Anyware.Core<["a", "b"], Anyware.HookMap<["a", "b"]>, Input>>;
export declare let anyware: Anyware.Builder<$Core>;
export declare let core: $Core;
export declare const runWithOptions: (options?: Options) => (...extensions: ExtensionInput[]) => Promise<unknown>;
export declare const run: (...extensions: ExtensionInput[]) => Promise<unknown>;
export declare const oops: Error;
export {};
//# sourceMappingURL=specHelpers.d.ts.map