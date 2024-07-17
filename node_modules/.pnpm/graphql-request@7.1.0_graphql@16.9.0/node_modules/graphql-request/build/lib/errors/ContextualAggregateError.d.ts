import type { Include } from '../prelude.js';
import { ContextualError } from './ContextualError.js';
/**
 * Aggregation Error enhanced with a context object and types members.
 *
 * The library also exports a serializer you can use.
 */
export declare class ContextualAggregateError<$Errors extends Error | ContextualError = ContextualError, $Name extends string = `ContextualAggregateError`, $Context extends object = object> extends ContextualError<$Name, $Context> {
    readonly errors: readonly $Errors[];
    name: $Name;
    constructor(message: string, context: $Context, errors: readonly $Errors[]);
}
export declare const partitionAndAggregateErrors: <Results>(results: Results[]) => [Exclude<Results, Error>[], null | ContextualAggregateError<Include<Results, Error>>];
//# sourceMappingURL=ContextualAggregateError.d.ts.map