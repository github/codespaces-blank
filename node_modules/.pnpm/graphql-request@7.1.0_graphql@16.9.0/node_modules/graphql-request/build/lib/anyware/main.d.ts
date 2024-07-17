import { Errors } from '../errors/__.js';
import type { Deferred, FindValueAfter, IsLastValue, MaybePromise } from '../prelude.js';
type HookSequence = readonly [string, ...string[]];
type ExtensionOptions = {
    retrying: boolean;
};
export type Extension2<$Core extends Core = Core, $Options extends ExtensionOptions = ExtensionOptions> = (hooks: ExtensionHooks<$Core[PrivateTypesSymbol]['hookSequence'], $Core[PrivateTypesSymbol]['hookMap'], $Core[PrivateTypesSymbol]['result'], $Options>) => Promise<$Core[PrivateTypesSymbol]['result'] | SomeHookEnvelope>;
type ExtensionHooks<$HookSequence extends HookSequence, $HookMap extends Record<$HookSequence[number], object> = Record<$HookSequence[number], object>, $Result = unknown, $Options extends ExtensionOptions = ExtensionOptions> = {
    [$HookName in $HookSequence[number]]: Hook<$HookSequence, $HookMap, $Result, $HookName, $Options>;
};
type CoreInitialInput<$Core extends Core> = $Core[PrivateTypesSymbol]['hookMap'][$Core[PrivateTypesSymbol]['hookSequence'][0]];
declare const PrivateTypesSymbol: unique symbol;
export type PrivateTypesSymbol = typeof PrivateTypesSymbol;
declare const hookSymbol: unique symbol;
type HookSymbol = typeof hookSymbol;
export type SomeHookEnvelope = {
    [name: string]: SomeHook;
};
export type SomeHook<fn extends (input: any) => any = (input: any) => any> = fn & {
    [hookSymbol]: HookSymbol;
    input: Parameters<fn>[0];
};
export type HookMap<$HookSequence extends HookSequence> = Record<$HookSequence[number], any>;
type Hook<$HookSequence extends HookSequence, $HookMap extends HookMap<$HookSequence> = HookMap<$HookSequence>, $Result = unknown, $Name extends $HookSequence[number] = $HookSequence[number], $Options extends ExtensionOptions = ExtensionOptions> = (<$$Input extends $HookMap[$Name]>(input?: $$Input) => HookReturn<$HookSequence, $HookMap, $Result, $Name, $Options>) & {
    [hookSymbol]: HookSymbol;
    input: $HookMap[$Name];
};
type HookReturn<$HookSequence extends HookSequence, $HookMap extends HookMap<$HookSequence> = HookMap<$HookSequence>, $Result = unknown, $Name extends $HookSequence[number] = $HookSequence[number], $Options extends ExtensionOptions = ExtensionOptions> = ($Options['retrying'] extends true ? Error : never) | (IsLastValue<$Name, $HookSequence> extends true ? $Result : {
    [$NameNext in FindValueAfter<$Name, $HookSequence>]: Hook<$HookSequence, $HookMap, $Result, $NameNext>;
});
export type Core<$HookSequence extends HookSequence = HookSequence, $HookMap extends HookMap<$HookSequence> = HookMap<$HookSequence>, $Result = unknown> = {
    [PrivateTypesSymbol]: {
        hookSequence: $HookSequence;
        hookMap: $HookMap;
        result: $Result;
    };
    hookNamesOrderedBySequence: $HookSequence;
    hooks: {
        [$HookName in $HookSequence[number]]: (input: $HookMap[$HookName]) => MaybePromise<IsLastValue<$HookName, $HookSequence> extends true ? $Result : $HookMap[FindValueAfter<$HookName, $HookSequence>]>;
    };
};
export type HookName = string;
export type Extension = NonRetryingExtension | RetryingExtension;
export type NonRetryingExtension = {
    retrying: false;
    name: string;
    entrypoint: string;
    body: Deferred<unknown>;
    currentChunk: Deferred<SomeHookEnvelope>;
};
export type RetryingExtension = {
    retrying: true;
    name: string;
    entrypoint: string;
    body: Deferred<unknown>;
    currentChunk: Deferred<SomeHookEnvelope | Error>;
};
export declare const createRetryingExtension: (extension: NonRetryingExtensionInput) => RetryingExtensionInput;
export type ExtensionInput<$Input extends object = any> = NonRetryingExtensionInput<$Input> | RetryingExtensionInput<$Input>;
export type NonRetryingExtensionInput<$Input extends object = any> = (input: $Input) => MaybePromise<unknown>;
export type RetryingExtensionInput<$Input extends object = any> = {
    retrying: boolean;
    run: (input: $Input) => MaybePromise<unknown>;
};
declare const ResultEnvelopeSymbol: unique symbol;
type ResultEnvelopeSymbol = typeof ResultEnvelopeSymbol;
export type ResultEnvelop<T = unknown> = {
    [ResultEnvelopeSymbol]: ResultEnvelopeSymbol;
    result: T;
};
export declare const createResultEnvelope: <T>(result: T) => ResultEnvelop<T>;
export type Options = {
    /**
     * @defaultValue `true`
     */
    entrypointSelectionMode?: 'optional' | 'required' | 'off';
};
export type Builder<$Core extends Core = Core> = {
    core: $Core;
    run: ({ initialInput, extensions, options }: {
        initialInput: CoreInitialInput<$Core>;
        extensions: Extension2<$Core>[];
        retryingExtension?: Extension2<$Core, {
            retrying: true;
        }>;
        options?: Options;
    }) => Promise<$Core[PrivateTypesSymbol]['result'] | Errors.ContextualError>;
};
export declare const create: <$HookSequence extends HookSequence = HookSequence, $HookMap extends HookMap<$HookSequence> = HookMap<$HookSequence>, $Result = unknown>(coreInput: Omit<Core<$HookSequence, $HookMap, $Result>, PrivateTypesSymbol>) => Builder<Core<$HookSequence, $HookMap, $Result>>;
export {};
//# sourceMappingURL=main.d.ts.map