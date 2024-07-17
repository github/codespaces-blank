"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = exports.partition = exports.dump = exports.errorFromUnknown = exports.isPromiseLikeValue = void 0;
const isPromiseLikeValue = (value) => {
    return (typeof value === `object` &&
        value !== null &&
        `then` in value &&
        typeof value.then === `function` &&
        `catch` in value &&
        typeof value.catch === `function` &&
        `finally` in value &&
        typeof value.finally === `function`);
};
exports.isPromiseLikeValue = isPromiseLikeValue;
const node_util_1 = require("node:util");
const errorFromUnknown = (x) => {
    if (x instanceof Error)
        return x;
    return new Error(String(x));
};
exports.errorFromUnknown = errorFromUnknown;
const dump = (...args) => console.log(...args.map((arg) => (0, node_util_1.inspect)(arg, { depth: Infinity, colors: true })));
exports.dump = dump;
const partition = (list, partitioner) => {
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
exports.partition = partition;
// prettier-ignore
//eslint-disable-next-line
function groupBy(items, key) {
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
exports.groupBy = groupBy;
//# sourceMappingURL=prelude.js.map