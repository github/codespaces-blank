/**
 * Refactored imports from `graphql` to be more specific, this helps import only the required files (100KiB)
 * instead of the entire package (greater than 500KiB) where tree-shaking is not supported.
 * @see https://github.com/jasonkuhrt/graphql-request/pull/543
 */
import type { OperationDefinitionNode } from 'graphql';
/**
 * Clean a GraphQL document to send it via a GET query
 */
export declare const cleanQuery: (str: string) => string;
export declare const isGraphQLContentType: (contentType: string) => boolean;
export type GraphQLRequestResult = GraphQLRequestResultBatch | GraphQLRequestResultSingle;
export type GraphQLRequestResultBatch = {
    _tag: 'Batch';
    executionResults: GraphQLExecutionResultBatch;
};
export type GraphQLRequestResultSingle = {
    _tag: 'Single';
    executionResult: GraphQLExecutionResultSingle;
};
export type GraphQLExecutionResult = GraphQLExecutionResultSingle | GraphQLExecutionResultBatch;
export type GraphQLExecutionResultBatch = GraphQLExecutionResultSingle[];
export type GraphQLExecutionResultSingle = {
    data: object | null | undefined;
    errors: undefined | object | object[];
    extensions?: object;
};
export declare const parseGraphQLExecutionResult: (result: unknown) => Error | GraphQLRequestResult;
/**
 * Example result:
 *
 * ```
 * {
 *  "data": null,
 *  "errors": [{
 *    "message": "custom error",
 *    "locations": [{ "line": 2, "column": 3 }],
 *    "path": ["playerNew"]
 *  }]
 * }
 * ```
 */
export declare const parseExecutionResult: (result: unknown) => GraphQLExecutionResultSingle;
export declare const isRequestResultHaveErrors: (result: GraphQLRequestResult) => boolean;
export declare const isExecutionResultHaveErrors: (result: GraphQLExecutionResultSingle) => boolean;
export declare const isOperationDefinitionNode: (definition: unknown) => definition is OperationDefinitionNode;
//# sourceMappingURL=graphql.d.ts.map