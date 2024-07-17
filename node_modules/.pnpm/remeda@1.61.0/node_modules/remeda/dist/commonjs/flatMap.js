"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMap = void 0;
var flatten_1 = require("./flatten");
var purry_1 = require("./purry");
function flatMap() {
    return (0, purry_1.purry)(_flatMap, arguments, flatMap.lazy);
}
exports.flatMap = flatMap;
function _flatMap(array, fn) {
    return (0, flatten_1.flatten)(array.map(function (item) { return fn(item); }));
}
(function (flatMap) {
    flatMap.lazy = function (fn) {
        return function (value) {
            var next = fn(value);
            return Array.isArray(next)
                ? { done: false, hasNext: true, hasMany: true, next: next }
                : { done: false, hasNext: true, next: next };
        };
    };
})(flatMap || (exports.flatMap = flatMap = {}));
