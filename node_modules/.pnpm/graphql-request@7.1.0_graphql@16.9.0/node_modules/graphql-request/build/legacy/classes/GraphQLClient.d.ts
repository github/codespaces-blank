import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { BatchRequestDocument, BatchRequestsOptions, BatchResult } from '../functions/batchRequests.js';
import type { RequestDocument, RequestOptions, VariablesAndRequestHeadersArgs } from '../helpers/types.js';
import { type GraphQLClientResponse, type RawRequestOptions, type RequestConfig, type Variables } from '../helpers/types.js';
/**
 * GraphQL Client.
 */
export declare class GraphQLClient {
    private url;
    readonly requestConfig: RequestConfig;
    constructor(url: string, requestConfig?: RequestConfig);
    /**
     * Send a GraphQL query to the server.
     */
    rawRequest: RawRequestMethod;
    /**
     * Send a GraphQL document to the server.
     */
    request<T, V extends Variables = Variables>(document: RequestDocument | TypedDocumentNode<T, V>, ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>): Promise<T>;
    request<T, V extends Variables = Variables>(options: RequestOptions<V, T>): Promise<T>;
    /**
     * Send GraphQL documents in batch to the server.
     */
    batchRequests<$BatchResult extends BatchResult, $Variables extends Variables = Variables>(documents: BatchRequestDocument<$Variables>[], requestHeaders?: HeadersInit): Promise<$BatchResult>;
    batchRequests<$BatchResult extends BatchResult, $Variables extends Variables = Variables>(options: BatchRequestsOptions<$Variables>): Promise<$BatchResult>;
    setHeaders(headers: HeadersInit): this;
    /**
     * Attach a header to the client. All subsequent requests will have this header.
     */
    setHeader(key: string, value: string): this;
    /**
     * Change the client endpoint. All subsequent requests will send to this endpoint.
     */
    setEndpoint(value: string): this;
}
interface RawRequestMethod {
    <T, V extends Variables = Variables>(query: string, variables?: V, requestHeaders?: HeadersInit): Promise<GraphQLClientResponse<T>>;
    <T, V extends Variables = Variables>(options: RawRequestOptions<V>): Promise<GraphQLClientResponse<T>>;
}
export {};
//# sourceMappingURL=GraphQLClient.d.ts.map