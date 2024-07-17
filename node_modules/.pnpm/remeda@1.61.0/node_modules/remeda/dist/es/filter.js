import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function filter() {
    return purry(_filter(false), arguments, filter.lazy);
}
var _filter = function (indexed) {
    return function (array, fn) {
        return _reduceLazy(array, indexed ? filter.lazyIndexed(fn) : filter.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) {
            return (indexed ? fn(value, index, array) : fn(value))
                ? { done: false, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
};
(function (filter) {
    function indexed() {
        return purry(_filter(true), arguments, filter.lazyIndexed);
    }
    filter.indexed = indexed;
    filter.lazy = _lazy(false);
    filter.lazyIndexed = _toLazyIndexed(_lazy(true));
})(filter || (filter = {}));
