"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var _toSingle_1 = require("./_toSingle");
var purry_1 = require("./purry");
function find() {
    return (0, purry_1.purry)(_find(false), arguments, find.lazy);
}
exports.find = find;
var _find = function (indexed) {
    return function (array, fn) {
        return array.find(function (item, index, input) {
            return indexed ? fn(item, index, input) : fn(item);
        });
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) {
            return (indexed ? fn(value, index, array) : fn(value))
                ? { done: true, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
};
(function (find) {
    function indexed() {
        return (0, purry_1.purry)(_find(true), arguments, find.lazyIndexed);
    }
    find.indexed = indexed;
    find.lazy = (0, _toSingle_1._toSingle)(_lazy(false));
    find.lazyIndexed = (0, _toSingle_1._toSingle)((0, _toLazyIndexed_1._toLazyIndexed)(_lazy(true)));
})(find || (exports.find = find = {}));
