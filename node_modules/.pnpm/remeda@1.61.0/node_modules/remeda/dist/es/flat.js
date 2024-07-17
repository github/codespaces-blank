import { lazyDataLastImpl } from "./_lazyDataLastImpl";
var DEFAULT_DEPTH = 1;
export function flat(dataOrDepth, depth) {
    if (typeof dataOrDepth === "object") {
        return flatImplementation(dataOrDepth, depth);
    }
    return lazyDataLastImpl(flatImplementation, arguments, lazyImplementation);
}
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
