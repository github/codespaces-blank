import { Errors } from '../errors/__.js';
import type { Deferred } from '../prelude.js';
import type { Core, Extension } from './main.js';
type HookDoneResolver = (input: HookResult) => void;
export type HookResultErrorAsync = Deferred<HookResultErrorExtension>;
export type HookResult = {
    type: 'completed';
    result: unknown;
    nextExtensionsStack: readonly Extension[];
} | {
    type: 'shortCircuited';
    result: unknown;
} | {
    type: 'error';
    hookName: string;
    source: 'user';
    error: Errors.ContextualError;
    extensionName: string;
} | HookResultErrorImplementation | HookResultErrorExtension;
export type HookResultErrorExtension = {
    type: 'error';
    hookName: string;
    source: 'extension';
    error: Error;
    extensionName: string;
};
export type HookResultErrorImplementation = {
    type: 'error';
    hookName: string;
    source: 'implementation';
    error: Error;
};
type Input = {
    core: Core;
    name: string;
    done: HookDoneResolver;
    originalInput: unknown;
    /**
     * The extensions that are at this hook awaiting.
     */
    extensionsStack: readonly Extension[];
    /**
     * The extensions that have advanced past this hook, to their next hook,
     * and are now awaiting.
     *
     * @remarks every extension popped off the stack is added here (except those
     * that short-circuit the pipeline or enter passthrough mode).
     */
    nextExtensionsStack: readonly Extension[];
    asyncErrorDeferred: HookResultErrorAsync;
};
export declare const runHook: ({ core, name, done, originalInput, extensionsStack, nextExtensionsStack, asyncErrorDeferred }: Input) => Promise<void>;
export {};
//# sourceMappingURL=runHook.d.ts.map