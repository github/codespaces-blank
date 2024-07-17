"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEach = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function forEach() {
    return (0, purry_1.purry)(_forEach(false), arguments, forEach.lazy);
}
exports.forEach = forEach;
var _forEach = function (indexed) {
    return function (array, fn) {
        return (0, _reduceLazy_1._reduceLazy)(array, indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) {
            if (indexed) {
                fn(value, index, array);
            }
            else {
                fn(value);
            }
            return {
                done: false,
                hasNext: true,
                next: value,
            };
        };
    };
};
(function (forEach) {
    function indexed() {
        return (0, purry_1.purry)(_forEach(true), arguments, forEach.lazyIndexed);
    }
    forEach.indexed = indexed;
    forEach.lazy = _lazy(false);
    forEach.lazyIndexed = (0, _toLazyIndexed_1._toLazyIndexed)(_lazy(true));
})(forEach || (exports.forEach = forEach = {}));
