export const uppercase = (str) => str.toUpperCase();
export const callOrIdentity = (value) => {
    return typeof value === `function` ? value() : value;
};
export const zip = (a, b) => a.map((k, i) => [k, b[i]]);
export const HeadersInitToPlainObject = (headers) => {
    let oHeaders = {};
    if (headers instanceof Headers) {
        oHeaders = HeadersInstanceToPlainObject(headers);
    }
    else if (Array.isArray(headers)) {
        headers.forEach(([name, value]) => {
            if (name && value !== undefined) {
                oHeaders[name] = value;
            }
        });
    }
    else if (headers) {
        oHeaders = headers;
    }
    return oHeaders;
};
export const HeadersInstanceToPlainObject = (headers) => {
    const o = {};
    headers.forEach((v, k) => {
        o[k] = v;
    });
    return o;
};
export const tryCatch = (fn) => {
    try {
        const result = fn();
        if (isPromiseLikeValue(result)) {
            return result.catch((error) => {
                return errorFromMaybeError(error);
            });
        }
        return result;
    }
    catch (error) {
        return errorFromMaybeError(error);
    }
};
/**
 * Ensure that the given value is an error and return it. If it is not an error than
 * wrap it in one, passing the given value as the error message.
 */
export const errorFromMaybeError = (maybeError) => {
    if (maybeError instanceof Error)
        return maybeError;
    return new Error(String(maybeError));
};
export const isPromiseLikeValue = (value) => {
    return (typeof value === `object`
        && value !== null
        && `then` in value
        && typeof value.then === `function`
        && `catch` in value
        && typeof value.catch === `function`
        && `finally` in value
        && typeof value.finally === `function`);
};
export const casesExhausted = (value) => {
    throw new Error(`Unhandled case: ${String(value)}`);
};
export const isPlainObject = (value) => {
    return typeof value === `object` && value !== null && !Array.isArray(value);
};
export const entries = (obj) => Object.entries(obj);
export const values = (obj) => Object.values(obj);
export const mapValues = (object, fn) => {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => {
        return [key, fn(value, key)];
    }));
};
export const lowerCaseFirstLetter = (s) => {
    return s.charAt(0).toLowerCase() + s.slice(1);
};
export function assertArray(v) {
    if (!Array.isArray(v))
        throw new Error(`Expected array. Got: ${String(v)}`);
}
export function assertObject(v) {
    if (v === null || typeof v !== `object`)
        throw new Error(`Expected object. Got: ${String(v)}`);
}
export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
export const createDeferred = (options) => {
    let isResolved = false;
    let resolve;
    let reject;
    const promise = new Promise(($resolve, $reject) => {
        resolve = $resolve;
        reject = $reject;
    });
    return {
        promise,
        isResolved: () => isResolved,
        resolve: (value) => {
            isResolved = true;
            if (options?.strict && isResolved) {
                throw new Error(`Deferred is already resolved. Attempted to resolve with: ${JSON.stringify(value)}`);
            }
            resolve(value);
        },
        reject: (error) => reject(error),
    };
};
export const debug = (...args) => {
    if (process.env[`DEBUG`]) {
        console.log(...args);
    }
};
export const debugSub = (...args) => (...subArgs) => {
    debug(...args, ...subArgs);
};
export const partitionErrors = (array) => {
    const errors = [];
    const values = [];
    for (const item of array) {
        if (item instanceof Error) {
            errors.push(item);
        }
        else {
            values.push(item);
        }
    }
    return [values, errors];
};
//# sourceMappingURL=prelude.js.map