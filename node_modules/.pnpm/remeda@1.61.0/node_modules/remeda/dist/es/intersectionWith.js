import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function intersectionWith() {
    return purry(_intersectionWith, arguments, intersectionWith.lazy);
}
function _intersectionWith(array, other, comparator) {
    var lazy = intersectionWith.lazy(other, comparator);
    return _reduceLazy(array, lazy);
}
(function (intersectionWith) {
    intersectionWith.lazy = function (other, comparator) {
        return function (value) {
            return other.some(function (otherValue) { return comparator(value, otherValue); })
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
})(intersectionWith || (intersectionWith = {}));
