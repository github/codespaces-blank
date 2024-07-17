"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flat = void 0;
var _lazyDataLastImpl_1 = require("./_lazyDataLastImpl");
var DEFAULT_DEPTH = 1;
function flat(dataOrDepth, depth) {
    if (typeof dataOrDepth === "object") {
        return flatImplementation(dataOrDepth, depth);
    }
    return (0, _lazyDataLastImpl_1.lazyDataLastImpl)(flatImplementation, arguments, lazyImplementation);
}
exports.flat = flat;
var lazyImplementation = function (depth) {
    if (depth === void 0) { depth = DEFAULT_DEPTH; }
    return depth <= 0
        ? lazyIdentity
        : depth === 1
            ? lazyShallow
            : function (value) {
                return Array.isArray(value)
                    ? {
                        next: flatImplementation(value, depth - 1),
                        hasNext: true,
                        hasMany: true,
                        done: false,
                    }
                    : { next: value, hasNext: true, done: false };
            };
};
var lazyIdentity = function (value) {
    return ({ next: value, hasNext: true, done: false });
};
var lazyShallow = function (value) {
    return Array.isArray(value)
        ? { next: value, hasNext: true, hasMany: true, done: false }
        : { next: value, hasNext: true, done: false };
};
function flatImplementation(data, depth) {
    if (depth === void 0) { depth = DEFAULT_DEPTH; }
    if (depth <= 0) {
        return data.slice();
    }
    var output = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        if (Array.isArray(item)) {
            output.push.apply(output, flatImplementation(item, depth - 1));
        }
        else {
            output.push(item);
        }
    }
    return output;
}
