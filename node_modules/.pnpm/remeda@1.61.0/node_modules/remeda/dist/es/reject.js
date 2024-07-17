import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function reject() {
    return purry(_reject(false), arguments, reject.lazy);
}
var _reject = function (indexed) {
    return function (array, fn) {
        return _reduceLazy(array, indexed ? reject.lazyIndexed(fn) : reject.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (item, index, data) {
            return (indexed ? fn(item, index, data) : fn(item))
                ? { done: false, hasNext: false }
                : { done: false, hasNext: true, next: item };
        };
    };
};
(function (reject) {
    function indexed() {
        return purry(_reject(true), arguments, reject.lazyIndexed);
    }
    reject.indexed = indexed;
    reject.lazy = _lazy(false);
    reject.lazyIndexed = _toLazyIndexed(_lazy(true));
})(reject || (reject = {}));
