import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function differenceWith() {
    return purry(_differenceWith, arguments, differenceWith.lazy);
}
function _differenceWith(array, other, isEquals) {
    var lazy = differenceWith.lazy(other, isEquals);
    return _reduceLazy(array, lazy);
}
(function (differenceWith) {
    differenceWith.lazy = function (other, isEquals) {
        return function (value) {
            return other.every(function (otherValue) { return !isEquals(value, otherValue); })
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
})(differenceWith || (differenceWith = {}));
