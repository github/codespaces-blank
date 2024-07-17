import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function drop() {
    return purry(_drop, arguments, drop.lazy);
}
function _drop(array, n) {
    return _reduceLazy(array, drop.lazy(n));
}
(function (drop) {
    function lazy(n) {
        var left = n;
        return function (value) {
            if (left > 0) {
                left -= 1;
                return { done: false, hasNext: false };
            }
            return { done: false, hasNext: true, next: value };
        };
    }
    drop.lazy = lazy;
})(drop || (drop = {}));
