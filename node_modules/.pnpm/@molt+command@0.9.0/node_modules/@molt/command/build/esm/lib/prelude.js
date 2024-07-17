export const isPromiseLikeValue = (value) => {
    return (typeof value === `object` &&
        value !== null &&
        `then` in value &&
        typeof value.then === `function` &&
        `catch` in value &&
        typeof value.catch === `function` &&
        `finally` in value &&
        typeof value.finally === `function`);
};
import { inspect } from 'node:util';
export const errorFromUnknown = (x) => {
    if (x instanceof Error)
        return x;
    return new Error(String(x));
};
export const dump = (...args) => console.log(...args.map((arg) => inspect(arg, { depth: Infinity, colors: true })));
export const partition = (list, partitioner) => {
    const left = [];
    const right = [];
    for (const item of list) {
        if (partitioner(item)) {
            right.push(item);
        }
        else {
            left.push(item);
        }
    }
    return [left, right];
};
// prettier-ignore
//eslint-disable-next-line
export function groupBy(items, key) {
    const result = {};
    for (const item of items) {
        const keyValue = typeof key === `function` ? key(item) : item[key];
        if (typeof keyValue !== `string`) {
            const message = typeof key === `function` ? `Invalid key type returned from keyer function: ${typeof keyValue}` : `Invalid key type: ${typeof keyValue}`;
            throw Error(message);
        }
        if (!Array.isArray(result[keyValue]))
            result[keyValue] = [];
        result[keyValue].push(item); // eslint-disable-line
    }
    // eslint-disable-next-line
    return result; // eslint-disable-line
}
//# sourceMappingURL=prelude.js.map