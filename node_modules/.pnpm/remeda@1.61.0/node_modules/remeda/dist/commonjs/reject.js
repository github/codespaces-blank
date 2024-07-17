"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reject = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function reject() {
    return (0, purry_1.purry)(_reject(false), arguments, reject.lazy);
}
exports.reject = reject;
var _reject = function (indexed) {
    return function (array, fn) {
        return (0, _reduceLazy_1._reduceLazy)(array, indexed ? reject.lazyIndexed(fn) : reject.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (item, index, data) {
            return (indexed ? fn(item, index, data) : fn(item))
                ? { done: false, hasNext: false }
                : { done: false, hasNext: true, next: item };
        };
    };
};
(function (reject) {
    function indexed() {
        return (0, purry_1.purry)(_reject(true), arguments, reject.lazyIndexed);
    }
    reject.indexed = indexed;
    reject.lazy = _lazy(false);
    reject.lazyIndexed = (0, _toLazyIndexed_1._toLazyIndexed)(_lazy(true));
})(reject || (exports.reject = reject = {}));
