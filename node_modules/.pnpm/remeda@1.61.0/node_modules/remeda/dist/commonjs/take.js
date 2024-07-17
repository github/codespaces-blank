"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.take = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function take() {
    return (0, purry_1.purry)(_take, arguments, take.lazy);
}
exports.take = take;
function _take(array, n) {
    return (0, _reduceLazy_1._reduceLazy)(array, take.lazy(n));
}
(function (take) {
    function lazy(n) {
        if (n <= 0) {
            return function () { return ({ done: true, hasNext: false }); };
        }
        var remaining = n;
        return function (value) {
            remaining -= 1;
            return { done: remaining <= 0, hasNext: true, next: value };
        };
    }
    take.lazy = lazy;
})(take || (exports.take = take = {}));
