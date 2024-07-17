import { ContextualError } from '../errors/ContextualError.js';
import type { HookName, NonRetryingExtensionInput } from './main.js';
export declare class ErrorAnywareExtensionEntrypoint extends ContextualError<'ErrorGraffleExtensionEntryHook', {
    issue: ExtensionEntryHookIssue;
}> {
    constructor(context: {
        issue: ExtensionEntryHookIssue;
    });
}
export declare const ExtensionEntryHookIssue: {
    readonly multipleParameters: "multipleParameters";
    readonly noParameters: "noParameters";
    readonly notDestructured: "notDestructured";
    readonly destructuredWithoutEntryHook: "destructuredWithoutEntryHook";
    readonly multipleDestructuredHookNames: "multipleDestructuredHookNames";
};
export type ExtensionEntryHookIssue = typeof ExtensionEntryHookIssue[keyof typeof ExtensionEntryHookIssue];
export declare const getEntrypoint: (hookNames: readonly string[], extension: NonRetryingExtensionInput) => ErrorAnywareExtensionEntrypoint | HookName;
//# sourceMappingURL=getEntrypoint.d.ts.map