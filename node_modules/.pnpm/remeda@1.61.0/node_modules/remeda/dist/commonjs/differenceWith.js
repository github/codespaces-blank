"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.differenceWith = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function differenceWith() {
    return (0, purry_1.purry)(_differenceWith, arguments, differenceWith.lazy);
}
exports.differenceWith = differenceWith;
function _differenceWith(array, other, isEquals) {
    var lazy = differenceWith.lazy(other, isEquals);
    return (0, _reduceLazy_1._reduceLazy)(array, lazy);
}
(function (differenceWith) {
    differenceWith.lazy = function (other, isEquals) {
        return function (value) {
            return other.every(function (otherValue) { return !isEquals(value, otherValue); })
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
})(differenceWith || (exports.differenceWith = differenceWith = {}));
