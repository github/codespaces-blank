"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndex = void 0;
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var _toSingle_1 = require("./_toSingle");
var purry_1 = require("./purry");
function findIndex() {
    return (0, purry_1.purry)(_findIndex(false), arguments, findIndex.lazy);
}
exports.findIndex = findIndex;
var _findIndex = function (indexed) {
    return function (array, fn) {
        return array.findIndex(function (item, index, input) {
            return indexed ? fn(item, index, input) : fn(item);
        });
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        var actualIndex = 0;
        return function (value, index, array) {
            if (indexed ? fn(value, index, array) : fn(value)) {
                return { done: true, hasNext: true, next: actualIndex };
            }
            actualIndex += 1;
            return { done: false, hasNext: false };
        };
    };
};
(function (findIndex) {
    function indexed() {
        return (0, purry_1.purry)(_findIndex(true), arguments, findIndex.lazyIndexed);
    }
    findIndex.indexed = indexed;
    findIndex.lazy = (0, _toSingle_1._toSingle)(_lazy(false));
    findIndex.lazyIndexed = (0, _toSingle_1._toSingle)((0, _toLazyIndexed_1._toLazyIndexed)(_lazy(true)));
})(findIndex || (exports.findIndex = findIndex = {}));
