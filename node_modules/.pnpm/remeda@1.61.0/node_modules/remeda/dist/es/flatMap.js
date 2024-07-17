import { flatten } from "./flatten";
import { purry } from "./purry";
export function flatMap() {
    return purry(_flatMap, arguments, flatMap.lazy);
}
function _flatMap(array, fn) {
    return flatten(array.map(function (item) { return fn(item); }));
}
(function (flatMap) {
    flatMap.lazy = function (fn) {
        return function (value) {
            var next = fn(value);
            return Array.isArray(next)
                ? { done: false, hasNext: true, hasMany: true, next: next }
                : { done: false, hasNext: true, next: next };
        };
    };
})(flatMap || (flatMap = {}));
