import type { Cause, Context } from './types.js';
/**
 * Error enhanced with a context object.
 *
 * The library also exports a serializer you can use.
 */
export declare class ContextualError<$Name extends string = string, $Context extends Context = object, $Cause extends Cause | undefined = Cause | undefined> extends Error {
    readonly context: $Context;
    readonly cause: $Cause;
    name: $Name;
    constructor(message: string, context?: $Context, cause?: $Cause);
}
//# sourceMappingURL=ContextualError.d.ts.map