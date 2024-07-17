import { GraphQLClient } from '../classes/GraphQLClient.js';
// dprint-ignore
// eslint-disable-next-line
export async function request(urlOrOptions, document, ...variablesAndRequestHeaders) {
    const requestOptions = parseRequestExtendedArgs(urlOrOptions, document, ...variablesAndRequestHeaders);
    const client = new GraphQLClient(requestOptions.url);
    return client.request({
        ...requestOptions,
    });
}
export const parseRequestArgs = (documentOrOptions, variables, requestHeaders) => {
    return documentOrOptions.document
        ? documentOrOptions
        : {
            document: documentOrOptions,
            variables: variables,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
};
export const parseRequestExtendedArgs = (urlOrOptions, document, ...variablesAndRequestHeaders) => {
    const [variables, requestHeaders] = variablesAndRequestHeaders;
    return typeof urlOrOptions === `string`
        ? {
            url: urlOrOptions,
            document: document,
            variables,
            requestHeaders,
            signal: undefined,
        }
        : urlOrOptions;
};
//# sourceMappingURL=request.js.map