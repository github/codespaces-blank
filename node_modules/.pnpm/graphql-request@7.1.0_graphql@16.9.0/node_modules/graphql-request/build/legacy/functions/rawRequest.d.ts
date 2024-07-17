import type { GraphQLClientResponse, RawRequestOptions, Variables, VariablesAndRequestHeadersArgs } from '../helpers/types.js';
/**
 * Send a GraphQL Query to the GraphQL server for execution.
 */
export declare const rawRequest: RawRequest;
interface RawRequest {
    <T, V extends Variables = Variables>(url: string, query: string, ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>): Promise<GraphQLClientResponse<T>>;
    <T, V extends Variables = Variables>(options: RawRequestExtendedOptions<V>): Promise<GraphQLClientResponse<T>>;
}
export declare const parseRawRequestExtendedArgs: <V extends Variables = object>(urlOrOptions: string | RawRequestExtendedOptions<V>, query?: string, ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>) => RawRequestExtendedOptions<V>;
export type RawRequestExtendedOptions<V extends Variables = Variables> = {
    url: string;
} & RawRequestOptions<V>;
export declare const parseRawRequestArgs: <V extends Variables = object>(queryOrOptions: string | RawRequestOptions<V>, variables?: V, requestHeaders?: HeadersInit) => RawRequestOptions<V>;
export {};
//# sourceMappingURL=rawRequest.d.ts.map