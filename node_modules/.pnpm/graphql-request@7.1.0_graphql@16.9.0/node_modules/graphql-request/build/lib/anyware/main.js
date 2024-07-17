import { Errors } from '../errors/__.js';
import { partitionAndAggregateErrors } from '../errors/ContextualAggregateError.js';
import { casesExhausted, createDeferred } from '../prelude.js';
import { getEntrypoint } from './getEntrypoint.js';
import { runPipeline } from './runPipeline.js';
const PrivateTypesSymbol = Symbol(`private`);
const hookSymbol = Symbol(`hook`);
export const createRetryingExtension = (extension) => {
    return {
        retrying: true,
        run: extension,
    };
};
const ResultEnvelopeSymbol = Symbol(`resultEnvelope`);
export const createResultEnvelope = (result) => ({
    [ResultEnvelopeSymbol]: ResultEnvelopeSymbol,
    result,
});
const createPassthrough = (hookName) => async (hookEnvelope) => {
    const hook = hookEnvelope[hookName];
    if (!hook) {
        throw new Errors.ContextualError(`Hook not found in hook envelope`, { hookName });
    }
    return await hook(hook.input);
};
const resolveOptions = (options) => {
    return {
        entrypointSelectionMode: options?.entrypointSelectionMode ?? `required`,
    };
};
export const create = (coreInput) => {
    const core = coreInput;
    const builder = {
        core,
        run: async (input) => {
            const { initialInput, extensions, options, retryingExtension } = input;
            const extensions_ = retryingExtension ? [...extensions, createRetryingExtension(retryingExtension)] : extensions;
            const initialHookStackAndErrors = extensions_.map(extension => toInternalExtension(core, resolveOptions(options), extension));
            const [initialHookStack, error] = partitionAndAggregateErrors(initialHookStackAndErrors);
            if (error)
                return error;
            const asyncErrorDeferred = createDeferred({ strict: false });
            const result = await runPipeline({
                core,
                hookNamesOrderedBySequence: core.hookNamesOrderedBySequence,
                originalInput: initialInput,
                // @ts-expect-error fixme
                extensionsStack: initialHookStack,
                asyncErrorDeferred,
            });
            if (result instanceof Error)
                return result;
            return result.result;
        },
    };
    return builder;
};
const toInternalExtension = (core, config, extension) => {
    const currentChunk = createDeferred();
    const body = createDeferred();
    const extensionRun = typeof extension === `function` ? extension : extension.run;
    const retrying = typeof extension === `function` ? false : extension.retrying;
    const applyBody = async (input) => {
        try {
            const result = await extensionRun(input);
            body.resolve(result);
        }
        catch (error) {
            body.reject(error);
        }
    };
    const extensionName = extensionRun.name || `anonymous`;
    switch (config.entrypointSelectionMode) {
        case `off`: {
            void currentChunk.promise.then(applyBody);
            return {
                name: extensionName,
                entrypoint: core.hookNamesOrderedBySequence[0], // todo non-empty-array data structure
                body,
                currentChunk,
            };
        }
        case `optional`:
        case `required`: {
            const entrypoint = getEntrypoint(core.hookNamesOrderedBySequence, extensionRun);
            if (entrypoint instanceof Error) {
                if (config.entrypointSelectionMode === `required`) {
                    return entrypoint;
                }
                else {
                    void currentChunk.promise.then(applyBody);
                    return {
                        name: extensionName,
                        entrypoint: core.hookNamesOrderedBySequence[0], // todo non-empty-array data structure
                        body,
                        currentChunk,
                    };
                }
            }
            const hooksBeforeEntrypoint = [];
            for (const hookName of core.hookNamesOrderedBySequence) {
                if (hookName === entrypoint)
                    break;
                hooksBeforeEntrypoint.push(hookName);
            }
            const passthroughs = hooksBeforeEntrypoint.map((hookName) => createPassthrough(hookName));
            let currentChunkPromiseChain = currentChunk.promise;
            for (const passthrough of passthroughs) {
                currentChunkPromiseChain = currentChunkPromiseChain.then(passthrough); // eslint-disable-line
            }
            void currentChunkPromiseChain.then(applyBody);
            return {
                retrying,
                name: extensionName,
                entrypoint,
                body,
                currentChunk,
            };
        }
        default:
            throw casesExhausted(config.entrypointSelectionMode);
    }
};
//# sourceMappingURL=main.js.map