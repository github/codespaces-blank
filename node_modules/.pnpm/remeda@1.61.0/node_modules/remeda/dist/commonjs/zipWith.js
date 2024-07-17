"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipWith = void 0;
function zipWith(arg0, arg1, arg2) {
    if (typeof arg0 === "function") {
        return arg1 === undefined
            ? function (f, s) {
                return _zipWith(f, s, arg0);
            }
            : function (f) { return _zipWith(f, arg1, arg0); };
    }
    if (arg1 === undefined || arg2 === undefined) {
        throw new Error("zipWith: Missing arguments in dataFirst function call");
    }
    return _zipWith(arg0, arg1, arg2);
}
exports.zipWith = zipWith;
function _zipWith(first, second, fn) {
    var resultLength = first.length > second.length ? second.length : first.length;
    var result = [];
    for (var i = 0; i < resultLength; i++) {
        result.push(fn(first[i], second[i]));
    }
    return result;
}
