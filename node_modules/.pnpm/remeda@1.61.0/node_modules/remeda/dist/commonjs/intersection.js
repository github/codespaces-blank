"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersection = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _utilityEvaluators_1 = require("./_utilityEvaluators");
var purry_1 = require("./purry");
function intersection() {
    return (0, purry_1.purry)(_intersection, arguments, intersection.lazy);
}
exports.intersection = intersection;
function _intersection(array, other) {
    var lazy = intersection.lazy(other);
    return (0, _reduceLazy_1._reduceLazy)(array, lazy);
}
(function (intersection) {
    function lazy(other) {
        var set = new Set(other);
        return function (value) {
            return set.has(value)
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    }
    intersection.lazy = lazy;
    function multiset() {
        return (0, purry_1.purry)(multisetImplementation, arguments, multisetLazyImplementation);
    }
    intersection.multiset = multiset;
})(intersection || (exports.intersection = intersection = {}));
var multisetImplementation = function (array, other) { return (0, _reduceLazy_1._reduceLazy)(array, multisetLazyImplementation(other)); };
function multisetLazyImplementation(other) {
    var _a;
    if (other.length === 0) {
        return _utilityEvaluators_1.lazyEmptyEvaluator;
    }
    var remaining = new Map();
    for (var _i = 0, other_1 = other; _i < other_1.length; _i++) {
        var value = other_1[_i];
        remaining.set(value, ((_a = remaining.get(value)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    return function (value) {
        var copies = remaining.get(value);
        if (copies === undefined || copies === 0) {
            return { done: false, hasNext: false };
        }
        if (copies === 1) {
            remaining.delete(value);
        }
        else {
            remaining.set(value, copies - 1);
        }
        return {
            hasNext: true,
            next: value,
            done: remaining.size === 0,
        };
    };
}
