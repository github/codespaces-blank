import { ContextualError } from './ContextualError.js';
import type { Cause, Context } from './types.js';
export declare class ErrorInternal<$Name extends string = 'ErrorInternal', $Context extends Context = Context, $Cause extends Cause | undefined = undefined> extends ContextualError<$Name, $Context, $Cause> {
    name: $Name;
    constructor(message?: string, context?: $Context, cause?: $Cause);
}
//# sourceMappingURL=ErrorInternal.d.ts.map