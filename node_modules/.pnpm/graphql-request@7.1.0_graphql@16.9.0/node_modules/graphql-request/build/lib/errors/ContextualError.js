/**
 * Error enhanced with a context object.
 *
 * The library also exports a serializer you can use.
 */
export class ContextualError extends Error {
    context;
    cause;
    name = `ContextualError`;
    constructor(message, context = {}, cause = undefined) {
        super(message, cause);
        this.context = context;
        this.cause = cause;
    }
}
//# sourceMappingURL=ContextualError.js.map