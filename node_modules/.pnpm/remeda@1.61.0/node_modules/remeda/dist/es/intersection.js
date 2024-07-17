import { _reduceLazy } from "./_reduceLazy";
import { lazyEmptyEvaluator } from "./_utilityEvaluators";
import { purry } from "./purry";
export function intersection() {
    return purry(_intersection, arguments, intersection.lazy);
}
function _intersection(array, other) {
    var lazy = intersection.lazy(other);
    return _reduceLazy(array, lazy);
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
        return purry(multisetImplementation, arguments, multisetLazyImplementation);
    }
    intersection.multiset = multiset;
})(intersection || (intersection = {}));
var multisetImplementation = function (array, other) { return _reduceLazy(array, multisetLazyImplementation(other)); };
function multisetLazyImplementation(other) {
    var _a;
    if (other.length === 0) {
        return lazyEmptyEvaluator;
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
