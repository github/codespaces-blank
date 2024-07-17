import { _toLazyIndexed } from "./_toLazyIndexed";
import { _toSingle } from "./_toSingle";
import { purry } from "./purry";
export function find() {
    return purry(_find(false), arguments, find.lazy);
}
var _find = function (indexed) {
    return function (array, fn) {
        return array.find(function (item, index, input) {
            return indexed ? fn(item, index, input) : fn(item);
        });
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) {
            return (indexed ? fn(value, index, array) : fn(value))
                ? { done: true, hasNext: true, next: value }
                : { done: false, hasNext: false };
        };
    };
};
(function (find) {
    function indexed() {
        return purry(_find(true), arguments, find.lazyIndexed);
    }
    find.indexed = indexed;
    find.lazy = _toSingle(_lazy(false));
    find.lazyIndexed = _toSingle(_toLazyIndexed(_lazy(true)));
})(find || (find = {}));
