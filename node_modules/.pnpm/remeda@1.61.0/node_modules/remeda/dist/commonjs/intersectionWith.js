"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectionWith = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function intersectionWith() {
    return (0, purry_1.purry)(_intersectionWith, arguments, intersectionWith.lazy);
}
exports.intersectionWith = intersectionWith;
function _intersectionWith(array, other, comparator) {
    var lazy = intersectionWith.lazy(other, comparator);
    return (0, _reduceLazy_1._reduceLazy)(array, lazy);
}
(function (intersectionWith) {
    intersectionWith.lazy = function (other, comparator) {
        return function (value) {
            return other.some(function (otherValue) { return comparator(value, otherValue); })
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
})(intersectionWith || (exports.intersectionWith = intersectionWith = {}));
