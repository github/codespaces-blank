import { GraphQLClient } from '../classes/GraphQLClient.js';
/**
 * Send a GraphQL Query to the GraphQL server for execution.
 */
export const rawRequest = async (...args) => {
    const [urlOrOptions, query, ...variablesAndRequestHeaders] = args;
    const requestOptions = parseRawRequestExtendedArgs(urlOrOptions, query, ...variablesAndRequestHeaders);
    const client = new GraphQLClient(requestOptions.url);
    return client.rawRequest({
        ...requestOptions,
    });
};
export const parseRawRequestExtendedArgs = (urlOrOptions, query, ...variablesAndRequestHeaders) => {
    const [variables, requestHeaders] = variablesAndRequestHeaders;
    return typeof urlOrOptions === `string`
        ? {
            url: urlOrOptions,
            query: query,
            variables,
            requestHeaders,
            signal: undefined,
        }
        : urlOrOptions;
};
export const parseRawRequestArgs = (queryOrOptions, variables, requestHeaders) => {
    return queryOrOptions.query
        ? queryOrOptions
        : {
            query: queryOrOptions,
            variables: variables,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
};
//# sourceMappingURL=rawRequest.js.map