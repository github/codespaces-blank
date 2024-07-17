"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueWith = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function uniqueWith() {
    return (0, purry_1.purry)(uniqueWithImplementation, arguments, uniqueWith.lazy);
}
exports.uniqueWith = uniqueWith;
function uniqueWithImplementation(array, isEquals) {
    var lazy = uniqueWith.lazy(isEquals);
    return (0, _reduceLazy_1._reduceLazy)(array, lazy, true);
}
var _lazy = function (isEquals) {
    return function (value, index, array) {
        return array !== undefined &&
            array.findIndex(function (otherValue) { return isEquals(value, otherValue); }) === index
            ? { done: false, hasNext: true, next: value }
            : { done: false, hasNext: false };
    };
};
(function (uniqueWith) {
    uniqueWith.lazy = (0, _toLazyIndexed_1._toLazyIndexed)(_lazy);
})(uniqueWith || (exports.uniqueWith = uniqueWith = {}));
