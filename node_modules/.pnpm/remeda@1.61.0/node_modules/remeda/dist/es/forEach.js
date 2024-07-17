import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function forEach() {
    return purry(_forEach(false), arguments, forEach.lazy);
}
var _forEach = function (indexed) {
    return function (array, fn) {
        return _reduceLazy(array, indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn), indexed);
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        return function (value, index, array) {
            if (indexed) {
                fn(value, index, array);
            }
            else {
                fn(value);
            }
            return {
                done: false,
                hasNext: true,
                next: value,
            };
        };
    };
};
(function (forEach) {
    function indexed() {
        return purry(_forEach(true), arguments, forEach.lazyIndexed);
    }
    forEach.indexed = indexed;
    forEach.lazy = _lazy(false);
    forEach.lazyIndexed = _toLazyIndexed(_lazy(true));
})(forEach || (forEach = {}));
