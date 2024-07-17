import { Kind } from 'graphql';
import { CONTENT_TYPE_GQL, CONTENT_TYPE_JSON } from '../../lib/http.js';
import { isPlainObject } from '../../lib/prelude.js';
/**
 * Clean a GraphQL document to send it via a GET query
 */
export const cleanQuery = (str) => str.replace(/([\s,]|#[^\n\r]+)+/g, ` `).trim();
export const isGraphQLContentType = (contentType) => {
    const contentTypeLower = contentType.toLowerCase();
    return contentTypeLower.includes(CONTENT_TYPE_GQL) || contentTypeLower.includes(CONTENT_TYPE_JSON);
};
export const parseGraphQLExecutionResult = (result) => {
    try {
        if (Array.isArray(result)) {
            return {
                _tag: `Batch`,
                executionResults: result.map(parseExecutionResult),
            };
        }
        else if (isPlainObject(result)) {
            return {
                _tag: `Single`,
                executionResult: parseExecutionResult(result),
            };
        }
        else {
            throw new Error(`Invalid execution result: result is not object or array. \nGot:\n${String(result)}`);
        }
    }
    catch (e) {
        return e;
    }
};
/**
 * Example result:
 *
 * ```
 * {
 *  "data": null,
 *  "errors": [{
 *    "message": "custom error",
 *    "locations": [{ "line": 2, "column": 3 }],
 *    "path": ["playerNew"]
 *  }]
 * }
 * ```
 */
export const parseExecutionResult = (result) => {
    if (typeof result !== `object` || result === null) {
        throw new Error(`Invalid execution result: result is not object`);
    }
    let errors = undefined;
    let data = undefined;
    let extensions = undefined;
    if (`errors` in result) {
        if (!isPlainObject(result.errors) && !Array.isArray(result.errors)) {
            throw new Error(`Invalid execution result: errors is not plain object OR array`); // prettier-ignore
        }
        errors = result.errors;
    }
    // todo add test coverage for case of null. @see https://github.com/jasonkuhrt/graphql-request/issues/739
    if (`data` in result) {
        if (!isPlainObject(result.data) && result.data !== null) {
            throw new Error(`Invalid execution result: data is not plain object`); // prettier-ignore
        }
        data = result.data;
    }
    if (`extensions` in result) {
        if (!isPlainObject(result.extensions))
            throw new Error(`Invalid execution result: extensions is not plain object`); // prettier-ignore
        extensions = result.extensions;
    }
    return {
        data,
        errors,
        extensions,
    };
};
export const isRequestResultHaveErrors = (result) => result._tag === `Batch`
    ? result.executionResults.some(isExecutionResultHaveErrors)
    : isExecutionResultHaveErrors(result.executionResult);
export const isExecutionResultHaveErrors = (result) => Array.isArray(result.errors) ? result.errors.length > 0 : Boolean(result.errors);
export const isOperationDefinitionNode = (definition) => {
    return (typeof definition === `object`
        && definition !== null
        && `kind` in definition
        && definition.kind === Kind.OPERATION_DEFINITION);
};
//# sourceMappingURL=graphql.js.map