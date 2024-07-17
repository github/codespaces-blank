import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function uniqueWith() {
    return purry(uniqueWithImplementation, arguments, uniqueWith.lazy);
}
function uniqueWithImplementation(array, isEquals) {
    var lazy = uniqueWith.lazy(isEquals);
    return _reduceLazy(array, lazy, true);
}
var _lazy = function (isEquals) {
    return function (value, index, array) {
        return array !== undefined &&
            array.findIndex(function (otherValue) { return isEquals(value, otherValue); }) === index
            ? { done: false, hasNext: true, next: value }
            : { done: false, hasNext: false };
    };
};
(function (uniqueWith) {
    uniqueWith.lazy = _toLazyIndexed(_lazy);
})(uniqueWith || (uniqueWith = {}));
