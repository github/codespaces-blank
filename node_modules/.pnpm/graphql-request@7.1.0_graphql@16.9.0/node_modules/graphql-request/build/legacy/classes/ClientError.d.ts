import type { GraphQLRequestContext, GraphQLResponse } from '../helpers/types.js';
export declare class ClientError extends Error {
    response: GraphQLResponse;
    request: GraphQLRequestContext;
    constructor(response: GraphQLResponse, request: GraphQLRequestContext);
    private static extractMessage;
}
//# sourceMappingURL=ClientError.d.ts.map