import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function map() {
    return purry(_map(false), arguments, map.lazy);
}
var _map = function (indexed) {
    return function (array, fn) {
        return _reduceLazy(array, indexed ? map.lazyIndexed(fn) : map.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) { return ({
            done: false,
            hasNext: true,
            next: indexed ? fn(value, index, array) : fn(value),
        }); };
    };
};
(function (map) {
    function indexed() {
        return purry(_map(true), arguments, map.lazyIndexed);
    }
    map.indexed = indexed;
    map.lazy = _lazy(false);
    map.lazyIndexed = _toLazyIndexed(_lazy(true));
    map.strict = map;
})(map || (map = {}));
