"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function map() {
    return (0, purry_1.purry)(_map(false), arguments, map.lazy);
}
exports.map = map;
var _map = function (indexed) {
    return function (array, fn) {
        return (0, _reduceLazy_1._reduceLazy)(array, indexed ? map.lazyIndexed(fn) : map.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) { return ({
            done: false,
            hasNext: true,
            next: indexed ? fn(value, index, array) : fn(value),
        }); };
    };
};
(function (map) {
    function indexed() {
        return (0, purry_1.purry)(_map(true), arguments, map.lazyIndexed);
    }
    map.indexed = indexed;
    map.lazy = _lazy(false);
    map.lazyIndexed = (0, _toLazyIndexed_1._toLazyIndexed)(_lazy(true));
    map.strict = map;
})(map || (exports.map = map = {}));
