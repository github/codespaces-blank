import { _toLazyIndexed } from "./_toLazyIndexed";
import { _toSingle } from "./_toSingle";
import { purry } from "./purry";
export function findIndex() {
    return purry(_findIndex(false), arguments, findIndex.lazy);
}
var _findIndex = function (indexed) {
    return function (array, fn) {
        return array.findIndex(function (item, index, input) {
            return indexed ? fn(item, index, input) : fn(item);
        });
    };
};
var _lazy = function (indexed) {
    return function (fn) {
        var actualIndex = 0;
        return function (value, index, array) {
            if (indexed ? fn(value, index, array) : fn(value)) {
                return { done: true, hasNext: true, next: actualIndex };
            }
            actualIndex += 1;
            return { done: false, hasNext: false };
        };
    };
};
(function (findIndex) {
    function indexed() {
        return purry(_findIndex(true), arguments, findIndex.lazyIndexed);
    }
    findIndex.indexed = indexed;
    findIndex.lazy = _toSingle(_lazy(false));
    findIndex.lazyIndexed = _toSingle(_toLazyIndexed(_lazy(true)));
})(findIndex || (findIndex = {}));
