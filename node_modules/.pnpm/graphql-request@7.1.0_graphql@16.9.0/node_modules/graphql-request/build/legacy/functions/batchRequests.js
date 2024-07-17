import { GraphQLClient } from '../classes/GraphQLClient.js';
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
export const batchRequests = async (...args) => {
    const params = parseBatchRequestsArgsExtended(args);
    const client = new GraphQLClient(params.url);
    return client.batchRequests(params);
};
export const parseBatchRequestsArgsExtended = (args) => {
    if (args.length === 1) {
        return args[0];
    }
    else {
        return {
            url: args[0],
            documents: args[1],
            requestHeaders: args[2],
            signal: undefined,
        };
    }
};
export const parseBatchRequestArgs = (documentsOrOptions, requestHeaders) => {
    // eslint-disable-next-line
    return documentsOrOptions.documents
        ? documentsOrOptions
        : {
            documents: documentsOrOptions,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
};
//# sourceMappingURL=batchRequests.js.map