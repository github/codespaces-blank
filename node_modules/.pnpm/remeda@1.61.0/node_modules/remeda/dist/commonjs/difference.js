"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.difference = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _utilityEvaluators_1 = require("./_utilityEvaluators");
var purry_1 = require("./purry");
function difference() {
    return (0, purry_1.purry)(_difference, arguments, difference.lazy);
}
exports.difference = difference;
function _difference(array, other) {
    var lazy = difference.lazy(other);
    return (0, _reduceLazy_1._reduceLazy)(array, lazy);
}
(function (difference) {
    function lazy(other) {
        var set = new Set(other);
        return function (value) {
            return set.has(value)
                ? { done: false, hasNext: false }
                : { done: false, hasNext: true, next: value };
        };
    }
    difference.lazy = lazy;
    function multiset() {
        return (0, purry_1.purry)(multisetImplementation, arguments, multisetLazyImplementation);
    }
    difference.multiset = multiset;
})(difference || (exports.difference = difference = {}));
var multisetImplementation = function (array, other) { return (0, _reduceLazy_1._reduceLazy)(array, multisetLazyImplementation(other)); };
function multisetLazyImplementation(other) {
    var _a;
    if (other.length === 0) {
        return _utilityEvaluators_1.lazyIdentityEvaluator;
    }
    var remaining = new Map();
    for (var _i = 0, other_1 = other; _i < other_1.length; _i++) {
        var value = other_1[_i];
        remaining.set(value, ((_a = remaining.get(value)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    return function (value) {
        var copies = remaining.get(value);
        if (copies === undefined || copies === 0) {
            return { done: false, hasNext: true, next: value };
        }
        remaining.set(value, copies - 1);
        return { done: false, hasNext: false };
    };
}
