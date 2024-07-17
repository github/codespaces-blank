import { ClientError } from '../classes/ClientError.js';
import type { BatchVariables, Fetch, FetchOptions, GraphQLClientResponse, HTTPMethodInput, RequestMiddleware, Variables } from './types.js';
interface Input {
    url: string;
    /**
     * The HTTP method to use for queries. Note that mutations are ALWAYS sent as POST requests ([per spec](https://github.com/graphql/graphql-over-http/blob/main/spec/GraphQLOverHTTP.md?rgh-link-date=2022-06-02T09%3A30%3A53Z)).
     *
     * @defaultValue `'POST'`
     */
    method?: HTTPMethodInput;
    fetch?: Fetch;
    fetchOptions: FetchOptions;
    headers?: HeadersInit;
    middleware?: RequestMiddleware;
    request: {
        _tag: 'Single';
        variables?: Variables;
        document: {
            expression: string;
            isMutation: boolean;
            operationName?: string;
        };
    } | {
        _tag: 'Batch';
        query: string[];
        operationName?: undefined;
        hasMutations: boolean;
        variables?: BatchVariables;
    };
}
export declare const runRequest: (input: Input) => Promise<ClientError | GraphQLClientResponse<any>>;
export {};
//# sourceMappingURL=runRequest.d.ts.map