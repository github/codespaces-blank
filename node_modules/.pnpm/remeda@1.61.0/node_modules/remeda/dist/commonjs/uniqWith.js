"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqWith = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function uniqWith() {
    return (0, purry_1.purry)(_uniqWith, arguments, uniqWith.lazy);
}
exports.uniqWith = uniqWith;
function _uniqWith(array, isEquals) {
    var lazy = uniqWith.lazy(isEquals);
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
(function (uniqWith) {
    uniqWith.lazy = (0, _toLazyIndexed_1._toLazyIndexed)(_lazy);
})(uniqWith || (exports.uniqWith = uniqWith = {}));
