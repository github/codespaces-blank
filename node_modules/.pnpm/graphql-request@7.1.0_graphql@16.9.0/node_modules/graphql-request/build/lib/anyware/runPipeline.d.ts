import type { Errors } from '../errors/__.js';
import type { Core, Extension, ResultEnvelop } from './main.js';
import type { HookResultErrorAsync } from './runHook.js';
export declare const runPipeline: ({ core, hookNamesOrderedBySequence, originalInput, extensionsStack, asyncErrorDeferred }: {
    core: Core;
    hookNamesOrderedBySequence: readonly string[];
    originalInput: unknown;
    extensionsStack: readonly Extension[];
    asyncErrorDeferred: HookResultErrorAsync;
}) => Promise<ResultEnvelop | Errors.ContextualError>;
//# sourceMappingURL=runPipeline.d.ts.map