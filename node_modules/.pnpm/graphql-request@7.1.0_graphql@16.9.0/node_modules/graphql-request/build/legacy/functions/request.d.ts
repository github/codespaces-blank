import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { RequestDocument, RequestOptions, Variables, VariablesAndRequestHeadersArgs } from '../helpers/types.js';
/**
 * Send a GraphQL Document to the GraphQL server for execution.
 *
 * @example
 *
 * ```ts
 * // You can pass a raw string
 *
 * await request('https://foo.bar/graphql', `
 *   {
 *     query {
 *       users
 *     }
 *   }
 * `)
 *
 * // You can also pass a GraphQL DocumentNode. Convenient if you
 * // are using graphql-tag package.
 *
 * import gql from 'graphql-tag'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 *
 * // If you don't actually care about using DocumentNode but just
 * // want the tooling support for gql template tag like IDE syntax
 * // coloring and prettier autoformat then note you can use the
 * // passthrough gql tag shipped with graphql-request to save a bit
 * // of performance and not have to install another dep into your project.
 *
 * import { gql } from 'graphql-request'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 * ```
 */
export declare function request<T, V extends Variables = Variables>(options: RequestExtendedOptions<V, T>): Promise<T>;
export declare function request<T, V extends Variables = Variables>(url: string, document: RequestDocument | TypedDocumentNode<T, V>, ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>): Promise<T>;
export declare const parseRequestArgs: <V extends Variables = object>(documentOrOptions: RequestDocument | RequestOptions<V>, variables?: V, requestHeaders?: HeadersInit) => RequestOptions<V>;
export type RequestExtendedOptions<V extends Variables = Variables, T = unknown> = {
    url: string;
} & RequestOptions<V, T>;
export declare const parseRequestExtendedArgs: <V extends Variables = object>(urlOrOptions: string | RequestExtendedOptions<V>, document?: RequestDocument, ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>) => RequestExtendedOptions<V>;
//# sourceMappingURL=request.d.ts.map