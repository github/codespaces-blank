import type { RequestDocument, Variables } from '../helpers/types.js';
export type BatchRequestDocument<V extends Variables = Variables> = {
    document: RequestDocument;
    variables?: V;
};
export interface BatchRequestsOptions<V extends Variables = Variables> {
    documents: BatchRequestDocument<V>[];
    requestHeaders?: HeadersInit;
    signal?: RequestInit['signal'];
}
export interface BatchRequestsExtendedOptions<V extends Variables = Variables> extends BatchRequestsOptions<V> {
    url: string;
}
/**
 * Send a batch of GraphQL Document to the GraphQL server for execution.
 *
 * @example
 *
 * ```ts
 * // You can pass a raw string
 *
 * await batchRequests('https://foo.bar/graphql', [
 * {
 *  query: `
 *   {
 *     query {
 *       users
 *     }
 *   }`
 * },
 * {
 *   query: `
 *   {
 *     query {
 *       users
 *     }
 *   }`
 * }])
 *
 * // You can also pass a GraphQL DocumentNode as query. Convenient if you
 * // are using graphql-tag package.
 *
 * import gql from 'graphql-tag'
 *
 * await batchRequests('https://foo.bar/graphql', [{ query: gql`...` }])
 * ```
 */
export declare const batchRequests: BatchRequests;
type BatchRequestsArgs = [url: string, documents: BatchRequestDocument[], requestHeaders?: HeadersInit] | [options: BatchRequestsExtendedOptions];
export declare const parseBatchRequestsArgsExtended: (args: BatchRequestsArgs) => BatchRequestsExtendedOptions;
interface BatchRequests {
    <T extends BatchResult, V extends Variables = Variables>(url: string, documents: BatchRequestDocument<V>[], requestHeaders?: HeadersInit): Promise<T>;
    <T extends BatchResult, V extends Variables = Variables>(options: BatchRequestsExtendedOptions<V>): Promise<T>;
}
export type BatchResult = [Result, ...Result[]];
interface Result<Data extends object = object> {
    data: Data;
}
export declare const parseBatchRequestArgs: <V extends Variables = object>(documentsOrOptions: BatchRequestDocument<V>[] | BatchRequestsOptions<V>, requestHeaders?: HeadersInit) => BatchRequestsOptions<V>;
export {};
//# sourceMappingURL=batchRequests.d.ts.map