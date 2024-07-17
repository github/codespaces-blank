"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drop = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function drop() {
    return (0, purry_1.purry)(_drop, arguments, drop.lazy);
}
exports.drop = drop;
function _drop(array, n) {
    return (0, _reduceLazy_1._reduceLazy)(array, drop.lazy(n));
}
(function (drop) {
    function lazy(n) {
        var left = n;
        return function (value) {
            if (left > 0) {
                left -= 1;
                return { done: false, hasNext: false };
            }
            return { done: false, hasNext: true, next: value };
        };
    }
    drop.lazy = lazy;
})(drop || (exports.drop = drop = {}));
