import type { ExecutionResult } from 'graphql';
import type { BaseInput } from './types.js';
export type URLInput = URL | string;
export interface NetworkRequestInput extends BaseInput {
    url: URLInput;
    headers?: HeadersInit;
}
export type NetworkRequest = (input: NetworkRequestInput) => Promise<ExecutionResult>;
/**
 * @see https://graphql.github.io/graphql-over-http/draft/
 */
export declare const request: NetworkRequest;
//# sourceMappingURL=request.d.ts.map