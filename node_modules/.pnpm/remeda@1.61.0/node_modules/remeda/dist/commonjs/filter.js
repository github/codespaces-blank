"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function filter() {
    return (0, purry_1.purry)(_filter(false), arguments, filter.lazy);
}
exports.filter = filter;
var _filter = function (indexed) {
    return function (array, fn) {
        return (0, _reduceLazy_1._reduceLazy)(array, indexed ? filter.lazyIndexed(fn) : filter.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) {
            return (indexed ? fn(value, index, array) : fn(value))
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
};
(function (filter) {
    function indexed() {
        return (0, purry_1.purry)(_filter(true), arguments, filter.lazyIndexed);
    }
    filter.indexed = indexed;
    filter.lazy = _lazy(false);
    filter.lazyIndexed = (0, _toLazyIndexed_1._toLazyIndexed)(_lazy(true));
})(filter || (exports.filter = filter = {}));
