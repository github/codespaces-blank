import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function uniqWith() {
    return purry(_uniqWith, arguments, uniqWith.lazy);
}
function _uniqWith(array, isEquals) {
    var lazy = uniqWith.lazy(isEquals);
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
(function (uniqWith) {
    uniqWith.lazy = _toLazyIndexed(_lazy);
})(uniqWith || (uniqWith = {}));
