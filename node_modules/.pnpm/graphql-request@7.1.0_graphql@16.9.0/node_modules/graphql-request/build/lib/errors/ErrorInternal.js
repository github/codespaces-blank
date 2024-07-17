import { ContextualError } from './ContextualError.js';
export class ErrorInternal extends ContextualError {
    name = `ErrorInternal`;
    constructor(message = `Something went wrong.`, context = {}, cause = undefined) {
        super(message, context, cause);
    }
}
//# sourceMappingURL=ErrorInternal.js.map