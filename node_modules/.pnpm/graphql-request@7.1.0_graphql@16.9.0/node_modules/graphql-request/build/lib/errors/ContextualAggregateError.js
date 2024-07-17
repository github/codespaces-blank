import { partitionErrors } from '../prelude.js';
import { ContextualError } from './ContextualError.js';
/**
 * Aggregation Error enhanced with a context object and types members.
 *
 * The library also exports a serializer you can use.
 */
export class ContextualAggregateError extends ContextualError {
    errors;
    name = `ContextualAggregateError`;
    constructor(message, context, errors) {
        super(message, context, undefined);
        this.errors = errors;
    }
}
export const partitionAndAggregateErrors = (results) => {
    const [values, errors] = partitionErrors(results);
    const error = errors.length > 0
        ? new ContextualAggregateError(`One or more extensions are invalid.`, {}, errors)
        : null;
    return [values, error];
};
//# sourceMappingURL=ContextualAggregateError.js.map